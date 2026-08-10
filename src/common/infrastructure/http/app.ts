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

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerAuthMiddleware, sweggerUI.serve, sweggerUI.setup(swaggerSpec))

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body ?? {}
  const expectedUser = process.env.AUTH_USER ?? process.env.SWAGGER_USER ?? 'admin'
  const expectedPass = process.env.AUTH_PASS ?? process.env.SWAGGER_PASS ?? 'admin123'

  if (username !== expectedUser || password !== expectedPass) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' })
  }

  const token = jwt.sign({ sub: username, role: 'admin' }, process.env.JWT_SECRET ?? 'dev-secret', {
    expiresIn: '8h',
  })

  return res.status(200).json({ access_token: token, token_type: 'Bearer' })
})

app.use((req, res, next) => {
  if (req.path.startsWith('/docs') || req.path === '/auth/login') {
    return next()
  }

  return jwtAuthMiddleware(req, res, next)
})

app.use(routes)
app.use(errorHandle)

export { app }
