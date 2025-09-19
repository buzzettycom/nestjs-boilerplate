// Example: Enhanced API Controller with comprehensive logging

import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpException } from '@nestjs/common';
import { LoggingService } from '../shared/logging/logging.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  private readonly context = UserController.name;

  constructor(
    private readonly userService: UserService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async getAllUsers() {
    this.loggingService.logApiRequest('GET', '/users', this.context);
    
    try {
      const users = await this.userService.findAll();
      
      this.loggingService.logApiResponse('GET', '/users', HttpStatus.OK, this.context, {
        count: users.length,
      });
      
      return users;
    } catch (error) {
      this.loggingService.error('Failed to get all users', this.context, error as Error);
      this.loggingService.logApiResponse('GET', '/users', HttpStatus.INTERNAL_SERVER_ERROR, this.context);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    this.loggingService.logApiRequest('GET', `/users/${id}`, this.context, { userId: id });
    
    try {
      const user = await this.userService.findById(id);
      
      if (!user) {
        this.loggingService.warn('User not found', this.context, { userId: id });
        this.loggingService.logApiResponse('GET', `/users/${id}`, HttpStatus.NOT_FOUND, this.context);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      this.loggingService.logApiResponse('GET', `/users/${id}`, HttpStatus.OK, this.context);
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.loggingService.error('Failed to get user', this.context, error as Error, { userId: id });
      this.loggingService.logApiResponse('GET', `/users/${id}`, HttpStatus.INTERNAL_SERVER_ERROR, this.context);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    this.loggingService.logApiRequest('POST', '/users', this.context, {
      email: userData.email,
      name: userData.name,
    });
    
    try {
      this.loggingService.logMethodEntry('createUser', this.context, {
        email: userData.email,
      });
      
      const user = await this.userService.create(userData);
      
      this.loggingService.log('User created successfully', this.context, {
        userId: user.id,
        email: user.email,
      });
      
      this.loggingService.logApiResponse('POST', '/users', HttpStatus.CREATED, this.context, {
        userId: user.id,
      });
      
      return user;
    } catch (error) {
      this.loggingService.error('Failed to create user', this.context, error as Error, {
        email: userData.email,
      });
      
      this.loggingService.logApiResponse('POST', '/users', HttpStatus.BAD_REQUEST, this.context);
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    this.loggingService.logApiRequest('PUT', `/users/${id}`, this.context, {
      userId: id,
      fields: Object.keys(updateData),
    });
    
    try {
      const user = await this.userService.update(id, updateData);
      
      this.loggingService.log('User updated successfully', this.context, {
        userId: id,
        updatedFields: Object.keys(updateData),
      });
      
      this.loggingService.logApiResponse('PUT', `/users/${id}`, HttpStatus.OK, this.context);
      return user;
    } catch (error) {
      this.loggingService.error('Failed to update user', this.context, error as Error, {
        userId: id,
      });
      
      this.loggingService.logApiResponse('PUT', `/users/${id}`, HttpStatus.BAD_REQUEST, this.context);
      throw new HttpException('Failed to update user', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.loggingService.logApiRequest('DELETE', `/users/${id}`, this.context, { userId: id });
    
    try {
      await this.userService.delete(id);
      
      this.loggingService.log('User deleted successfully', this.context, { userId: id });
      this.loggingService.logApiResponse('DELETE', `/users/${id}`, HttpStatus.OK, this.context);
      
      return { message: 'User deleted successfully' };
    } catch (error) {
      this.loggingService.error('Failed to delete user', this.context, error as Error, {
        userId: id,
      });
      
      this.loggingService.logApiResponse('DELETE', `/users/${id}`, HttpStatus.BAD_REQUEST, this.context);
      throw new HttpException('Failed to delete user', HttpStatus.BAD_REQUEST);
    }
  }
}

// Example log output for POST /users:
/*
[Nest] 12345  - 2025/09/19, 10:30:00   LOG [UserController] POST /users | {"email":"john@example.com","name":"John Doe"}
[Nest] 12345  - 2025/09/19, 10:30:00 DEBUG [UserController] → createUser() | {"email":"john@example.com"}
[Nest] 12345  - 2025/09/19, 10:30:01   LOG [UserService] DB INSERT on users | {"email":"john@example.com"}
[Nest] 12345  - 2025/09/19, 10:30:01   LOG [UserController] User created successfully | {"userId":"uuid-123","email":"john@example.com"}
[Nest] 12345  - 2025/09/19, 10:30:01   LOG [UserController] POST /users → 201 | {"userId":"uuid-123"}
*/