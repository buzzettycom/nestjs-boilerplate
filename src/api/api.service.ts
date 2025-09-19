import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../shared/auth/auth.service';
import { DatabaseService } from '../shared/database/database.service';
import { UtilsService } from '../shared/utils/utils.service';
import { User, Contact } from '../shared/entities';
import type {
  HealthResponse,
  LoginCredentials,
  LoginResponse,
  RegisterData,
  UserUpdateData,
  PublicDataResponse,
  ContactData,
} from '../shared/interfaces';

@Injectable()
export class ApiService {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly utilsService: UtilsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  getHealth(): HealthResponse {
    return {
      status: 'OK',
      timestamp: this.utilsService.formatDate(new Date()),
      version: '1.0.0',
    };
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Public API login logic
    const { email } = credentials;

    if (!this.utilsService.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Find user by email using TypeORM
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    if (user) {
      // Update last login timestamp
      await this.userRepository.update(user.id, {
        lastLoginAt: new Date(),
      });

      const token = this.authService.generateToken(user);
      return { token, user };
    }

    throw new Error('Invalid credentials');
  }

  async register(userData: RegisterData): Promise<User> {
    // Public API registration logic
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
      isActive: true,
    });

    return this.userRepository.save(newUser);
  }

  async getProfile(id: string): Promise<User | null> {
    // Get user profile (public API)
    return this.userRepository.findOne({
      where: { id, isActive: true },
      select: ['id', 'email', 'name', 'profile', 'createdAt'],
    });
  }

  async updateProfile(id: string, profileData: UserUpdateData): Promise<User> {
    // Update user profile (public API)
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update user data
    await this.userRepository.update(id, {
      name: profileData.name,
      profile: profileData.profile,
    });

    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    return updatedUser;
  }

  getPublicData(): PublicDataResponse {
    // Get public data that doesn't require authentication
    return {
      message: 'Welcome to our API',
      features: ['Fast', 'Reliable', 'Secure'],
      timestamp: this.utilsService.formatDate(new Date()),
    };
  }

  async submitContact(contactData: ContactData): Promise<Contact> {
    // Submit contact form
    const sanitizedEmail = this.utilsService.sanitizeInput(contactData.email);
    const sanitizedMessage = this.utilsService.sanitizeInput(
      contactData.message,
    );

    if (!this.utilsService.validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
    }

    // Create new contact entry
    const newContact = this.contactRepository.create({
      email: sanitizedEmail,
      name: contactData.name,
      subject: contactData.subject,
      message: sanitizedMessage,
      status: 'pending',
    });

    return this.contactRepository.save(newContact);
  }
}
