import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ApiService } from './api.service';
import type {
  LoginCredentials,
  RegisterData,
  UserUpdateData,
  ContactData,
} from '../shared/interfaces';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('health')
  getHealth() {
    return this.apiService.getHealth();
  }

  @Post('auth/login')
  login(@Body() credentials: LoginCredentials) {
    return this.apiService.login(credentials);
  }

  @Post('auth/register')
  register(@Body() userData: RegisterData) {
    return this.apiService.register(userData);
  }

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.apiService.getProfile(id);
  }

  @Put('profile/:id')
  updateProfile(@Param('id') id: string, @Body() profileData: UserUpdateData) {
    return this.apiService.updateProfile(id, profileData);
  }

  @Get('public/data')
  getPublicData() {
    return this.apiService.getPublicData();
  }

  @Post('contact')
  submitContact(@Body() contactData: ContactData) {
    return this.apiService.submitContact(contactData);
  }
}
