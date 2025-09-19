import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigurationModule } from '../config/configuration.module';
import { LoggingService } from './logging/logging.service';

@Module({
  imports: [ConfigurationModule, AuthModule, DatabaseModule, UtilsModule],
  providers: [LoggingService],
  exports: [AuthModule, DatabaseModule, UtilsModule, LoggingService],
})
export class SharedModule {}
