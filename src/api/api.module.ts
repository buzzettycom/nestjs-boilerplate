import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { SharedModule } from '../shared/shared.module';
import { User, Contact } from '../shared/entities';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([User, Contact]),
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
