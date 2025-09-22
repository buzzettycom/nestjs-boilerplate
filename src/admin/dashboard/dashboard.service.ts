import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Contact, Setting, AdminLog } from '../../shared/entities';
import type { AdminDashboardData } from '../../shared/interfaces';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(AdminLog)
    private readonly adminLogRepository: Repository<AdminLog>,
  ) {}

  async getDashboardData(): Promise<AdminDashboardData> {
    this.logger.log('Getting dashboard data');

    try {
      // Get user statistics
      const totalUsers = await this.userRepository.count();
      const activeUsers = await this.userRepository.count({
        where: { isActive: true },
      });
      const adminUsers = await this.userRepository.count({
        where: { isAdmin: true },
      });

      // Get contact statistics
      const totalContacts = await this.contactRepository.count();
      const pendingContacts = await this.contactRepository.count({
        where: { status: 'pending' },
      });

      // Get recent activities (admin logs)
      const recentActivities = await this.adminLogRepository.find({
        take: 10,
        order: { createdAt: 'DESC' },
        relations: ['admin'],
      });

      // Get system settings count
      const totalSettings = await this.settingRepository.count();

      const dashboardData: AdminDashboardData = {
        totalUsers,
        activeUsers,
        adminUsers,
        totalContacts,
        pendingContacts,
        totalSettings,
        recentActivities: recentActivities.map((activity) => ({
          id: activity.id,
          action: activity.action,
          resource: activity.resource,
          adminName: activity.admin?.name || 'Unknown',
          createdAt: activity.createdAt,
          details: activity.details,
        })),
        systemStatus: 'healthy',
        uptime: process.uptime(),
        lastUpdated: new Date(),
      };

      this.logger.log(`Dashboard data retrieved successfully`);
      return dashboardData;
    } catch (error) {
      this.logger.error('Failed to get dashboard data', error);
      throw error;
    }
  }

  async getSystemHealth(): Promise<any> {
    this.logger.log('Getting system health information');

    try {
      // Basic health checks
      const databaseConnected = await this.checkDatabaseConnection();
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();

      return {
        status: databaseConnected ? 'healthy' : 'unhealthy',
        database: databaseConnected,
        uptime,
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to get system health', error);
      throw error;
    }
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.userRepository.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
