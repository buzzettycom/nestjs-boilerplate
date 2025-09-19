import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import type { DatabaseConfig } from '../../config/database.config';
import { User, Contact, Setting, AdminLog } from '../entities';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(AdminLog)
    private readonly adminLogRepository: Repository<AdminLog>,
    @Inject('database') private readonly databaseConfig: DatabaseConfig,
  ) {}

  getDataSource(): DataSource {
    return this.dataSource;
  }

  getUserRepository(): Repository<User> {
    return this.userRepository;
  }

  getContactRepository(): Repository<Contact> {
    return this.contactRepository;
  }

  getSettingRepository(): Repository<Setting> {
    return this.settingRepository;
  }

  getAdminLogRepository(): Repository<AdminLog> {
    return this.adminLogRepository;
  }

  async runMigrations(): Promise<void> {
    await this.dataSource.runMigrations();
  }

  async revertLastMigration(): Promise<void> {
    await this.dataSource.undoLastMigration();
  }

  // Legacy method for backward compatibility - will be deprecated
  async query(sql: string): Promise<any[]> {
    console.log(`Executing raw query: ${sql}`);
    return this.dataSource.query(sql);
  }

  async transaction<T>(operation: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      console.log('Starting database transaction');
      const result = await operation();
      console.log('Transaction completed successfully');
      return result;
    });
  }
}
