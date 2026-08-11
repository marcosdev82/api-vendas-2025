import { DataSource } from 'typeorm'
import { env } from '@/common/infrastructure/env'

export const testDataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  schema: env.DB_SCHELMA,
  entities: ['src/**/entities/**/*.ts'],
  migrations: ['src/**/migrations/**/*.ts'],
  synchronize: true,
  logging: true,
})
