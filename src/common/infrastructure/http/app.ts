/* eslint-disable prettier/prettier */
import 'reflect-metadata'
import express from 'express';
import 'express-async-errors';
import cors from  'cors';
import { routes } from './routes';
import { errorHandle } from './middleware/errorHandlers';
import  sweggerJSDoc from 'swagger-jsdoc';
import  sweggerUI from 'swagger-ui-express';
import { swaggerAuthMiddleware } from './swagger-auth';
import { jwtAuthMiddleware } from './jwt-auth';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../auth/password';
import { dataSource } from '../typeorm';
import { User } from '@/users/infrastructure/typeorm/entities/users.entity';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestLoggerMiddleware } from './middleware/request-logger';
import { cacheMiddleware } from '../cache/cache-middleware';

const swaggerServers = [
  {
    url: process.env.SWAGGER_SERVER_URL ?? 'http://localhost:3333',
    description: 'Development',
  },
  {
    url: process.env.SWAGGER_SERVER_URL_TEST ?? 'http://localhost:3334',
    description: 'Test',
  },
  {
    url: process.env.SWAGGER_SERVER_URL_PROD ?? 'https://api.example.com',
    description: 'Production',
  },
]

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: swaggerServers,
  },
  apis: ['./src/**/http/routes/*.ts'],
}
const swaggerSpec = sweggerJSDoc(options)

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(helmet());
app.use(limiter);
app.use(requestLoggerMiddleware);
app.use(cacheMiddleware(60));
app.use(cors());
app.use(express.json());
app.get('/health', async (_req, res) => {
  if (!dataSource.isInitialized) {
    return res.status(503).json({ status: 'error', service: 'api', database: 'disconnected' })
  }

  try {
    await dataSource.query('SELECT 1')
    return res.status(200).json({ status: 'ok', service: 'api', database: 'connected' })
  } catch {
    return res.status(503).json({ status: 'error', service: 'api', database: 'disconnected' })
  }
})
app.use('/docs', swaggerAuthMiddleware, sweggerUI.serve, sweggerUI.setup(swaggerSpec))

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {}

  if (!username || !password) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' })
  }

  const userRepository = dataSource.getRepository(User)
  const user = await userRepository.findOneBy({ email: username })

  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' })
  }

  const validPassword = await comparePassword(password, user.password)
  if (!validPassword) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' })
  }

  const token = jwt.sign({ sub: user.id, role: 'admin', email: user.email }, process.env.JWT_SECRET ?? 'dev-secret', {
    expiresIn: '8h',
  })

  return res.status(200).json({ access_token: token, token_type: 'Bearer' })
})

app.use((req, res, next) => {
  const isPublicRoute =
    req.path.startsWith('/docs') ||
    req.path.startsWith('/auth/login') ||
    (req.path === '/users' && req.method === 'POST')

  if (isPublicRoute) {
    return next()
  }

  return jwtAuthMiddleware(req, res, next)
})

app.use(routes)
app.use(errorHandle)

export { app }
