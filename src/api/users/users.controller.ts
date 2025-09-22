import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import type {
  LoginCredentials,
  RegisterData,
  UserUpdateData,
} from '../../shared/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() credentials: LoginCredentials) {
    return this.usersService.login(credentials);
  }

  @Post('register')
  register(@Body() userData: RegisterData) {
    return this.usersService.register(userData);
  }

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Put('profile/:id')
  updateProfile(@Param('id') id: string, @Body() updateData: UserUpdateData) {
    return this.usersService.updateProfile(id, updateData);
  }
}