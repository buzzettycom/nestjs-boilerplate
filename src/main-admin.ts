import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
  const configService = app.get(ConfigService);

  // Get configuration from environment
  const adminPort = configService.get<number>('app.adminPort') || 3001;
  const corsOrigins = configService.get<string[]>('app.corsOrigins') || [
    'http://localhost:3001',
    'http://admin.localhost',
  ];
  const adminPrefix = configService.get<string>('app.adminPrefix') || 'admin';

  // Enable CORS for admin interface
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Set global prefix for admin routes
  app.setGlobalPrefix(adminPrefix);

  await app.listen(adminPort);

  console.log(`Admin service is running on: http://localhost:${adminPort}`);
  console.log(`Admin routes: http://localhost:${adminPort}/${adminPrefix}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start admin service:', error);
  process.exit(1);
});
