import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ApiModule } from './api/api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const configService = app.get(ConfigService);

  // Get configuration from environment
  const apiPort = configService.get<number>('app.apiPort') || 3000;
  const corsOrigins = configService.get<string[]>('app.corsOrigins') || [
    'http://localhost:3000',
    'https://yourdomain.com',
  ];
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';

  // Enable CORS for public API
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Set global prefix for API routes
  app.setGlobalPrefix(apiPrefix);

  await app.listen(apiPort);

  console.log(`API service is running on: http://localhost:${apiPort}`);
  console.log(`API routes: http://localhost:${apiPort}/${apiPrefix}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start API service:', error);
  process.exit(1);
});
