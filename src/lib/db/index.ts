import pg from 'pg'
import { SECRET_DB_HOST, SECRET_DB_PORT, SECRET_DB_NAME, SECRET_DB_USER, SECRET_DB_PASSWORD } from '$env/static/private'

export const pool = new pg.Pool({
  host: SECRET_DB_HOST,
  port: parseInt(SECRET_DB_PORT),
  database: SECRET_DB_NAME,
  user: SECRET_DB_USER,
  password: SECRET_DB_PASSWORD,
})

