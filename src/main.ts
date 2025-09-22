import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configuration from environment
  const port = configService.get<number>('app.port') || 3000;
  const corsOrigins = configService.get<string[]>('app.corsOrigins') || [
    'http://localhost:3000',
  ];
  const adminPrefix = configService.get<string>('app.adminPrefix') || 'admin';
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';

  // Enable CORS for the unified service
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);

  console.log(`Unified service is running on: http://localhost:${port}`);
  console.log(`Admin routes: http://localhost:${port}/${adminPrefix}`);
  console.log(`API routes: http://localhost:${port}/${apiPrefix}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
