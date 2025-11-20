import { logger } from '../core/logger';
import { AppDataSource } from './data-source';

export async function shutdownDatabase() {
  if (AppDataSource.isInitialized) {
    logger.info("Shutting down database connection pool")
    await AppDataSource.destroy();
  }
}
