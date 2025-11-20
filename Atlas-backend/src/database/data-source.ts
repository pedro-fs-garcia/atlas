import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { nodeEnv, postgresConfig } from '../env_config';


export const AppDataSource = new DataSource({
  type: 'postgres',

  host: postgresConfig.host,
  port: Number(postgresConfig.port),
  username: postgresConfig.user,
  password: postgresConfig.password,
  database: postgresConfig.database,

  // strict pool configuration — required for production
  extra: {
    max: Number(process.env.DB_POOL_MAX || 10),
    min: Number(process.env.DB_POOL_MIN || 2),
    idleTimeoutMillis: 30000,
    charset: 'UTF8',
    client_encoding: 'UTF8',
  },

  synchronize: false ? nodeEnv === 'production' : true,
  migrationsRun: false,

  logging: ['error'], // never use 'all'
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
