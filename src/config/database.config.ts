import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const databaseConfig = registerAs('database', () => ({
  type: 'sqlite',
  database: process.env.DATABASE_FILE || 'database/db.sqlite',
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  synchronize: process.env.NODE_ENV !== 'production',
  migrationsRun: true,
  logging: process.env.DATABASE_LOGGING === 'true',
}));

export const getDatabaseConfig = (): DataSourceOptions => ({
  ...databaseConfig(),
  type: 'sqlite',
});
