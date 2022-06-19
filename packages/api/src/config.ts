import { config } from 'dotenv'

if (process.env.NODE_ENV !== 'production') config()

const NODE_ENV: string = process.env.NODE_ENV || 'development'

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000

const DB_POSTGRES_HOST: string = process.env.DB_POSTGRES_HOST || 'localhost'

const DB_POSTGRES_PORT: number = process.env.DB_POSTGRES_PORT
  ? parseInt(process.env.DB_POSTGRES_PORT)
  : 5432

const DB_POSTGRES_USERNAME: string =
  process.env.DB_POSTGRES_USERNAME || 'postgres'

const DB_POSTGRES_PASSWORD: string =
  process.env.DB_POSTGRES_PASSWORD || 'postgres'

const DB_POSTGRES_DATABASE: string =
  process.env.DB_POSTGRES_DATABASE || 'trimes-shiksha'

const DB_POSTGRES_SYNCHRONIZE: boolean =
  process.env.DB_POSTGRES_SYNCHRONIZE === 'true'

const DB_POSTGRES_URI: string = process.env.DB_POSTGRES_URI || 'localhost'

const CORS_ORIGIN: string = process.env.CORS_ORIGIN || '*'

export {
  NODE_ENV,
  PORT,
  DB_POSTGRES_HOST,
  DB_POSTGRES_PORT,
  DB_POSTGRES_USERNAME,
  DB_POSTGRES_PASSWORD,
  DB_POSTGRES_DATABASE,
  CORS_ORIGIN,
  DB_POSTGRES_SYNCHRONIZE,
  DB_POSTGRES_URI
}
