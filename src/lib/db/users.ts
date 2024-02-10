import { v4 as uuidv4 } from 'uuid';
import type { QueryConfig, QueryResult } from 'pg';
import { pool } from './index'; 
import type { User } from "../types";

export async function getUser(id: string): Promise<User>{
  const client = await pool.connect()

  const query: QueryConfig = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [id],
  }

  const promise = client.query(query)
    .then((res: QueryResult<User>) => {
      const user = res.rows[0];
      return user;
    })
    .catch((err: Error) => {
      throw err;
    }).finally(() => {  
      client.release();
    });

  return promise;
}

export async function getUserByEmail(email: string): Promise<User>{
  const client = await pool.connect()

  const query: QueryConfig = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  }

  const promise = client.query(query)
    .then((res: QueryResult<User>) => {
      const user = res.rows[0];
      return user;
    })
    .catch((err: Error) => {
      throw err;
    }).finally(() => {  
      client.release();
    });

  return promise;
}

export async function doesUserExist(email: string): Promise<boolean>{
  const client = await pool.connect()

  const query: QueryConfig = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  }

  const promise = client.query(query)
    .then((res: QueryResult<User>) => {
      const user = res.rows[0];
      return user !== undefined;
    })
    .catch((err: Error) => {
      throw err;
    }).finally(() => {  
      client.release();
    });

  return promise;
}

export async function createUser(email: string, firstName: string, lastName: string): Promise<User>{
  const client = await pool.connect()

  const newUser: User = {
    id: uuidv4(),
    email: email,
    first_name: firstName,
    last_name: lastName
  }

  const query: QueryConfig = {
    text: 'INSERT INTO users (id, email, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [newUser.id, newUser.email, newUser.first_name, newUser.last_name],
  }

  const promise = client.query(query)
    .then((res: QueryResult<User>) => {
      const user = res.rows[0];
      return user;
    })
    .catch((err: Error) => {
      throw err;
    }).finally(() => {  
      client.release();
    });

  return promise;
}

export async function deleteUser(id: string): Promise<User>{
  const client = await pool.connect()

  const query: QueryConfig = {
    text: 'DELETE FROM users WHERE id = $1 RETURNING *',
    values: [id],
  }

  const promise = client.query(query)
    .then((res: QueryResult<User>) => {
      const user = res.rows[0];
      return user;
    })
    .catch((err: Error) => {
      throw err;
    }).finally(() => {  
      client.release();
    });

  return promise;
}