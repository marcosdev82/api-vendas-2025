import { DataSource } from 'typeorm'
import { env } from '../env'

export const dataSource = new DataSource({  
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  schema: env.DB_SCHELMA,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASS,
  entities: ['src/**/entities/**/*.ts'],
  migrations: ['src/**/migrations/**/*.ts'],
  synchronize: false,
  logging: false,
});
 