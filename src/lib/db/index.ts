import pg from "pg";
import type { PoolClient } from "pg";
import {
	SECRET_DB_HOST,
	SECRET_DB_PORT,
	SECRET_DB_NAME,
	SECRET_DB_USER,
	SECRET_DB_PASSWORD,
	SECRET_DB_SSL
} from "$env/static/private";

export const pool = new pg.Pool({
	host: SECRET_DB_HOST,
	port: parseInt(SECRET_DB_PORT),
	database: SECRET_DB_NAME,
	user: SECRET_DB_USER,
	password: SECRET_DB_PASSWORD,
	ssl: SECRET_DB_SSL === "true" ? true : false
});

export async function withConnection<Result>(
	fn: (client: PoolClient) => Promise<Result>
): Promise<Result> {
	const client = await pool.connect();
	try {
		return await fn(client);
	} finally {
		client.release();
	}
}
