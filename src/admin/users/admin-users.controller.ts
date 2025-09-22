import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import type {
  CreateUserDto,
  UpdateUserDto,
  UserListResponse,
} from '../../shared/interfaces';
import { User } from '../../shared/entities';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ): Promise<UserListResponse> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    if (search) {
      return this.adminUsersService.searchUsers(
        search,
        pageNumber,
        limitNumber,
      );
    }

    return this.adminUsersService.getAllUsers(pageNumber, limitNumber);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.adminUsersService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.adminUsersService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.adminUsersService.updateUser(id, updateUserDto);
  }

  @Put(':id/toggle-status')
  async toggleUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.adminUsersService.toggleUserStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.adminUsersService.deleteUser(id);
  }
}
