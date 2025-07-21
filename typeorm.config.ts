import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_FILE || 'database/db.sqlite',
  entities: [join(__dirname, 'src', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'database', 'migrations', '*{.ts,.js}')],
  logging: process.env.DATABASE_LOGGING === 'true',
});
