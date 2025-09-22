import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiAuthService } from '../../shared/auth/api-auth.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { User } from '../../shared/entities';
import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  UserUpdateData,
} from '../../shared/interfaces';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly authService: ApiAuthService,
    private readonly utilsService: UtilsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    this.logger.log(`Login attempt for email: ${credentials.email}`);

    try {
      const { email } = credentials;

      if (!this.utilsService.validateEmail(email)) {
        this.logger.warn(`Invalid email format in login: ${email}`);
        throw new BadRequestException('Invalid email format');
      }

      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        this.logger.warn(`Login failed: User not found for email: ${email}`);
        throw new NotFoundException('User not found');
      }

      // Validate credentials
      const isValidPassword = await this.authService.validateCredentials(
        credentials,
        user,
      );
      if (!isValidPassword) {
        this.logger.warn(`Login failed: Invalid password for email: ${email}`);
        throw new BadRequestException('Invalid credentials');
      }

      // Generate token pair
      const tokenPair = this.authService.generateTokenPair(user);

      // Update last login
      await this.userRepository.update(user.id, {
        lastLoginAt: new Date(),
      });

      return {
        token: tokenPair.accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profile: user.profile,
        },
      };
    } catch (error) {
      this.logger.error('Login failed', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<LoginResponse> {
    this.logger.log(`Registration attempt for email: ${userData.email}`);

    try {
      const { email, password, name } = userData;

      if (!this.utilsService.validateEmail(email)) {
        this.logger.warn(`Invalid email format in registration: ${email}`);
        throw new BadRequestException('Invalid email format');
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        this.logger.warn(
          `Registration failed: User already exists for email: ${email}`,
        );
        throw new BadRequestException('User already exists');
      }

      // Hash password
      const hashedPassword = await this.authService.hashPassword(password);

      // Create new user
      const newUser = this.userRepository.create({
        email,
        name,
        password: hashedPassword,
        isActive: true,
        isAdmin: false,
      });

      const savedUser = await this.userRepository.save(newUser);

      // Generate token pair
      const tokenPair = this.authService.generateTokenPair(savedUser);

      return {
        token: tokenPair.accessToken,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          name: savedUser.name,
          profile: savedUser.profile,
        },
      };
    } catch (error) {
      this.logger.error('Registration failed', error);
      throw error;
    }
  }

  async getProfile(id: string): Promise<any> {
    this.logger.log(`Getting profile for user: ${id}`);

    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: [
          'id',
          'email',
          'name',
          'profile',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });

      if (!user) {
        this.logger.warn(`Profile not found for user: ${id}`);
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      this.logger.error('Get profile failed', error);
      throw error;
    }
  }

  async updateProfile(id: string, updateData: UserUpdateData): Promise<any> {
    this.logger.log(`Updating profile for user: ${id}`);

    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        this.logger.warn(`Profile update failed: User not found for id: ${id}`);
        throw new NotFoundException('User not found');
      }

      // Update user data
      await this.userRepository.update(id, updateData);

      // Get updated user
      const updatedUser = await this.userRepository.findOne({
        where: { id },
        select: [
          'id',
          'email',
          'name',
          'profile',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });

      return {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      this.logger.error('Profile update failed', error);
      throw error;
    }
  }
}