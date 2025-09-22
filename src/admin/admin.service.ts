import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';
import { UtilsService } from '../shared/utils/utils.service';
import { LoggingService } from '../shared/logging/logging.service';
import { Setting, AdminLog } from '../shared/entities';
import type { AdminSettings } from '../shared/interfaces';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly context = AdminService.name;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly utilsService: UtilsService,
    private readonly loggingService: LoggingService,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(AdminLog)
    private readonly adminLogRepository: Repository<AdminLog>,
  ) {}

  async getSettings(): Promise<Setting[]> {
    // Get system settings
    return this.settingRepository.find({
      order: { key: 'ASC' },
    });
  }

  async updateSettings(settings: AdminSettings): Promise<void> {
    // Update system settings (admin only)
    for (const [key, settingValue] of Object.entries(settings)) {
      if (settingValue !== undefined) {
        // Use repository save instead of query builder to avoid type issues
        const existingSetting = await this.settingRepository.findOne({
          where: { key },
        });

        if (existingSetting) {
          existingSetting.value = { value: settingValue };
          existingSetting.dataType = typeof settingValue;
          await this.settingRepository.save(existingSetting);
        } else {
          const newSetting = this.settingRepository.create({
            key,
            value: { value: settingValue },
            dataType: typeof settingValue,
          });
          await this.settingRepository.save(newSetting);
        }
      }
    }
  }

  async logAdminAction(
    adminId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, any>,
  ): Promise<AdminLog> {
    // Log admin actions for audit trail
    const logEntry = this.adminLogRepository.create({
      adminId,
      action,
      resource,
      resourceId,
      details,
    });

    return this.adminLogRepository.save(logEntry);
  }

  async getAdminLogs(): Promise<AdminLog[]> {
    // Get admin action logs
    return this.adminLogRepository.find({
      relations: ['admin'],
      order: { createdAt: 'DESC' },
      take: 100, // Limit to last 100 logs
    });
  }
}
