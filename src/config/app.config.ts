import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  adminPort: number;
  apiPort: number;
  environment: string;
  corsOrigins: string[];
  globalPrefix: string;
  adminPrefix: string;
  apiPrefix: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT || '3000', 10),
    adminPort: parseInt(process.env.ADMIN_PORT || '3001', 10),
    apiPort: parseInt(process.env.API_PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    globalPrefix: process.env.GLOBAL_PREFIX || '',
    adminPrefix: process.env.ADMIN_PREFIX || 'admin',
    apiPrefix: process.env.API_PREFIX || 'api',
  }),
);
