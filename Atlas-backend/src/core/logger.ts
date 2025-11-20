import pino from 'pino';
import { logLevel, nodeEnv } from '../env_config';

export const logger = pino({
  level: logLevel || 'info',
  transport: nodeEnv !== 'production' ? { target: 'pino-pretty' } : undefined
});