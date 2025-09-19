import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { User, Contact, Setting, AdminLog } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [User, Contact, Setting, AdminLog],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        ssl: configService.get<boolean>('database.ssl'),
        migrations: ['dist/migrations/*.js'],
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Contact, Setting, AdminLog]),
  ],
  providers: [
    DatabaseService,
    {
      provide: 'database',
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    },
  ],
  exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
