import { Client } from "pg";
import { postgresConfig } from "../env_config";


export async function create_db_if_not_exists() {
    const { database, user, password, host, port } = postgresConfig;
    const client = new Client({
        user,
        password,
        host,
        port,
        database: 'postgres', // control DB
    });

    await client.connect();

    const res = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [database]
    );

    if (res.rowCount === 0) {
        await client.query(`CREATE DATABASE "${database}";`);
        console.log(`Database "${database}" created.`);
    }

    await client.end();

}