import { registerAs } from '@nestjs/config';
import { User, Contact, Setting, AdminLog } from '../shared/entities';

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  ssl: boolean;
  entities: any[];
  migrations: string[];
  migrationsDir: string;
  cli: {
    migrationsDir: string;
  };
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'nestjs_app',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    logging: process.env.DB_LOGGING === 'true' || false,
    ssl: process.env.DB_SSL === 'true' || false,
    entities: [User, Contact, Setting, AdminLog],
    migrations: ['dist/migrations/*.js'],
    migrationsDir: 'src/migrations',
    cli: {
      migrationsDir: 'src/migrations',
    },
  }),
);