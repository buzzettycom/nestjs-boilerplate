import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from './users/users.module';
import { Contact } from '../shared/entities';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Contact]), UsersModule],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
