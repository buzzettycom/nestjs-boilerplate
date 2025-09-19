import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SharedModule } from '../shared/shared.module';
import { User, Contact, Setting, AdminLog } from '../shared/entities';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([User, Contact, Setting, AdminLog]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
