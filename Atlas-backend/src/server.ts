import {app} from './app';
import { logger } from './core/logger';
import { create_db_if_not_exists } from './database/create_db';
import { AppDataSource } from './database/data-source';
import { seedDatabase } from './database/seed';
import { shutdownDatabase } from './database/shutdown';
import { port } from './env_config';


async function bootstrap() {
    await create_db_if_not_exists();

    await AppDataSource.initialize();
    logger.info(`Database connected`);

    // Automatically seed database if empty
    try {
        await seedDatabase();
    } catch (error) {
        logger.error(`Database seeding failed: ${String(error)}`);
        // Don't stop the server if seeding fails, just log the error
    }

    app.listen(port, () => {
        console.log(`Express Server running on port: ${port}`);
        logger.info(`Express Server running on port: ${port}`);
    });


    process.on('SIGINT', async () => {
        await shutdownDatabase();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await shutdownDatabase();
        process.exit(0);
    });
}


bootstrap().catch((err) => {
  console.error('Failed to start', err);
  process.exit(1);
});
