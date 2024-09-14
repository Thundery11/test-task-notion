import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const { PG_PORT, PG_DB, PG_USER, PG_PASSWORD, PG_HOST } = process.env;
export default new DataSource({
  type: 'postgres',
  host: PG_HOST,
  port: +PG_PORT,
  username: PG_USER,
  password: PG_PASSWORD,
  database: PG_DB,
  migrations: ['./migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],

  ssl: false,
});
