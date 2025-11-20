import * as dotenv from 'dotenv';

dotenv.config();

export const port = parseInt(process.env.PORT ?? '3000');

export const logLevel = process.env.LOG_LEVEL ?? 'info';

export const nodeEnv = process.env.NODE_ENV ?? 'development';

export const corsOrigins = (process.env.CORS_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean);

export const postgresConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'atlas',
};

export const envConfig = {
  port,
  logLevel,
  nodeEnv,
  corsOrigins,
  postgres: postgresConfig
};
