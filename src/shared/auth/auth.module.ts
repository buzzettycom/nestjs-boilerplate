import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Module({
  providers: [
    AuthService,
    {
      provide: 'auth',
      useFactory: (configService: ConfigService) => configService.get('auth'),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
