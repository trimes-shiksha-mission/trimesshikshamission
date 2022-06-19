import { Hello } from '@trimes-shiksha/entity'
import { DataSource } from 'typeorm'
import {
  DB_POSTGRES_DATABASE,
  DB_POSTGRES_HOST,
  DB_POSTGRES_PASSWORD,
  DB_POSTGRES_PORT,
  DB_POSTGRES_SYNCHRONIZE,
  DB_POSTGRES_URI,
  DB_POSTGRES_USERNAME
} from './config'

export const dataSource = new DataSource({
  type: 'postgres',
  host: DB_POSTGRES_HOST,
  port: DB_POSTGRES_PORT,
  username: DB_POSTGRES_USERNAME,
  password: DB_POSTGRES_PASSWORD,
  database: DB_POSTGRES_DATABASE,
  synchronize: DB_POSTGRES_SYNCHRONIZE,
  entities: [Hello],
  maxQueryExecutionTime: 2500,
  relationLoadStrategy: 'query',
  url: DB_POSTGRES_URI,
  ssl: {
    rejectUnauthorized: false
  }
})
