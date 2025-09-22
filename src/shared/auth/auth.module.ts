import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { ApiAuthService } from './api-auth.service';
import { AdminAuthService } from './admin-auth.service';

@Module({
  providers: [
    AuthService, // Keep for backward compatibility
    ApiAuthService,
    AdminAuthService,
    {
      provide: 'auth',
      useFactory: (configService: ConfigService) => configService.get('auth'),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService, ApiAuthService, AdminAuthService],
})
export class AuthModule {}
