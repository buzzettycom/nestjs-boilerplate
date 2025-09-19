import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigurationModule } from '../config/configuration.module';

@Module({
  imports: [ConfigurationModule, AuthModule, DatabaseModule, UtilsModule],
  exports: [AuthModule, DatabaseModule, UtilsModule],
})
export class SharedModule {}
