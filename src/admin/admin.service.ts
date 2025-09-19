import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../shared/auth/auth.service';
import { DatabaseService } from '../shared/database/database.service';
import { UtilsService } from '../shared/utils/utils.service';
import { User, Contact, Setting, AdminLog } from '../shared/entities';
import type {
  AdminDashboardData,
  UserCreateData,
  UserUpdateData,
  AdminSettings,
} from '../shared/interfaces';

@Injectable()
export class AdminService {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly utilsService: UtilsService,
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
    // Admin dashboard data logic
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({
      where: { isActive: true },
    });

    return {
      totalUsers,
      activeUsers,
      revenue: 50000, // This would come from a payments table in real app
      timestamp: this.utilsService.formatDate(new Date()),
    };
  }

  async getAllUsers(): Promise<User[]> {
    // Get all users for admin management
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'name', 'isActive', 'isAdmin', 'createdAt'],
    });
  }

  async getUser(id: string): Promise<User | null> {
    // Get specific user by ID
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(userData: UserCreateData): Promise<User> {
    // Create new user (admin only)
    const sanitizedEmail = this.utilsService.sanitizeInput(userData.email);
    if (!this.utilsService.validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = this.userRepository.create({
      email: sanitizedEmail,
      name: userData.name,
      password: userData.password, // Should be hashed in real app
      isActive: true,
    });

    return this.userRepository.save(newUser);
  }

  async updateUser(id: string, userData: UserUpdateData): Promise<User> {
    // Update user data (admin only)
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.update(id, {
      name: userData.name,
      email: userData.email,
      profile: userData.profile,
    });

    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    // Delete user (admin only)
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

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
