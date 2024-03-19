import { v4 as uuidv4 } from "uuid";
import type { QueryConfig, QueryResult } from "pg";
import { withConnection } from "./index";
import type { PartialUser, User } from "../types";

export async function getUser(id: string): Promise<User | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: "SELECT users.id, users.email, users.first_name, users.last_name FROM users WHERE id = $1",
			values: [id]
		};

		const res: QueryResult<User> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		const user = res.rows[0];
		return user;
	});
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: "SELECT users.id, users.email, users.first_name, users.last_name FROM users WHERE email = $1",
			values: [email]
		};

		const res: QueryResult<User> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		const user = res.rows[0];
		return user;
	});
}

export async function createUser(partialUser: PartialUser): Promise<User | undefined> {
	return withConnection(async client => {
		const newUser: User = {
			...partialUser,

			id: uuidv4()
		};

		const query: QueryConfig = {
			text: "INSERT INTO users (id, email, first_name, last_name) VALUES ($1, $2, $3, $4)",
			values: [newUser.id, newUser.email, newUser.first_name, newUser.last_name]
		};

		await client.query(query);

		return newUser;
	});
}

export async function deleteUser(id: string): Promise<User | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: "DELETE FROM users WHERE id = $1 RETURNING users.id, users.email, users.first_name, users.last_name",
			values: [id]
		};

		const res: QueryResult<User> = await client.query(query);
		const user = res.rows[0];
		return user;
	});
}
