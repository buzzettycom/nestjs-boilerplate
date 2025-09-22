import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User, Contact, Setting, AdminLog } from '../../shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Contact, Setting, AdminLog])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}