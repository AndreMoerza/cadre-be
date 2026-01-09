/**
 * This file is used by the TypeORM CLI to connect to the database.
 * Please do not use this file in the application code.
 * The application code should use the TypeORM module configuration.
 */

import 'dotenv/config';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  dropSchema: false,
  logging: true, // Set to true to see SQL logs
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
});
