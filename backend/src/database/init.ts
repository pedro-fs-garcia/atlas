import { postgresConfig } from '../env_config';
import { AppDataSource } from './data-source';
import { Client } from 'pg';


export async function initDatabase() {
    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            await AppDataSource.initialize();
            console.log('Database connected');
            return;
        } catch (err) {
            attempt++;
            console.error(`DB connection failed (attempt ${attempt})`);

            if (attempt === maxRetries) {
                throw err;
            }

            await new Promise(res => setTimeout(res, 2000));
        }
    }
}
