import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  API_URL: z.string().default('http://localhost:3333'),
  DB_TYPE: z.enum(['postgres', 'mysql']).default('postgres'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_SCHELMA: z.string().default('public'),
  DB_NAME: z.string().default('postgres'),
  DB_USER: z.string().default('postgres'),
  DB_PASS: z.string().default('postgres'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  DB_HOST_DOCKER: z.string().optional(),
  DB_PORT_DOCKER: z.coerce.number().optional(),
  REDIS_HOST_DOCKER: z.string().optional(),
  REDIS_PORT_DOCKER: z.coerce.number().optional(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}

const resolvedEnv = _env.data

export const env = {
  ...resolvedEnv,
  DB_HOST: process.env.DOCKER_CONTAINER === 'true' ? resolvedEnv.DB_HOST_DOCKER ?? resolvedEnv.DB_HOST : resolvedEnv.DB_HOST,
  DB_PORT: process.env.DOCKER_CONTAINER === 'true' ? resolvedEnv.DB_PORT_DOCKER ?? resolvedEnv.DB_PORT : resolvedEnv.DB_PORT,
  REDIS_HOST: process.env.DOCKER_CONTAINER === 'true' ? resolvedEnv.REDIS_HOST_DOCKER ?? resolvedEnv.REDIS_HOST : resolvedEnv.REDIS_HOST,
  REDIS_PORT: process.env.DOCKER_CONTAINER === 'true' ? resolvedEnv.REDIS_PORT_DOCKER ?? resolvedEnv.REDIS_PORT : resolvedEnv.REDIS_PORT,
}
