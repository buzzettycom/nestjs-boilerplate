import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SharedModule } from '../shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminUsersModule } from './users/admin-users.module';
import { Contact, Setting, AdminLog } from '../shared/entities';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Contact, Setting, AdminLog]),
    DashboardModule,
    AdminUsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
