import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities';
import {
  CreateUserDto,
  UpdateUserDto,
  UserListResponse,
} from '../../shared/interfaces';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(page = 1, limit = 10): Promise<UserListResponse> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'name', 'isActive', 'createdAt'],
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = this.userRepository.create({
      email,
      password, // Note: In a real app, this should be hashed
      name,
      isActive: true,
    });

    return await this.userRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    // Check if email is being changed and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  async toggleUserStatus(id: string): Promise<User> {
    const user = await this.getUserById(id);
    user.isActive = !user.isActive;
    return await this.userRepository.save(user);
  }

  async searchUsers(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<UserListResponse> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email ILIKE :query OR user.name ILIKE :query', {
        query: `%${query}%`,
      })
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.isActive',
        'user.createdAt',
      ])
      .getManyAndCount();

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
