import { withConnection } from "$lib/db";
import type { PartialUser, User } from "$lib/types";
import { bulkQuery } from "$lib/utils";
import { randomUUID } from "crypto";
import type { QueryConfig, QueryResult } from "pg";

export async function createUser(partialUser: PartialUser): Promise<User> {
	return withConnection(async client => {
		const newUser: User = {
			...partialUser,

			id: randomUUID()
		};

		const query: QueryConfig = {
			text: `
				INSERT INTO users (id, email, first_name, last_name)
				VALUES ($1, $2, $3, $4)
			`,
			values: [newUser.id, newUser.email, newUser.first_name, newUser.last_name]
		};

		await client.query(query);

		return newUser;
	});
}

export async function deleteUser(id: string): Promise<User | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				DELETE
				FROM users
				WHERE id = $1
				RETURNING
					users.id,
					users.email,
					users.first_name,
					users.last_name
				`,
			values: [id]
		};

		const res: QueryResult<User> = await client.query(query);
		const user = res.rows[0];
		return user;
	});
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				SELECT
					u.id,
					u.email,
					u.first_name,
					u.last_name
				FROM users u
				WHERE u.email = $1`,
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

export async function getUsers(userIDS: string[]): Promise<User[] | undefined> {
	return bulkQuery(userIDS, () =>
		withConnection(async client => {
			const query: QueryConfig = {
				text: `
					SELECT
						u.id,
						u.email,
						u.first_name,
						u.last_name
					FROM users u
					WHERE u.id = ANY($1)
				`,
				values: [userIDS]
			};

			const res: QueryResult<User> = await client.query(query);
			return res.rows;
		})
	);
}

export async function getUser(userID: string): Promise<User | undefined> {
		const users = await getUsers([userID]);
	
		if (users == undefined) {
			return;
		}
	
		return users[0];
}