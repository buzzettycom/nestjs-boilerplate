import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ApiService } from './api.service';
import { LoggingService } from '../shared/logging/logging.service';
import type {
  LoginCredentials,
  RegisterData,
  UserUpdateData,
  ContactData,
} from '../shared/interfaces';

@Controller('api')
export class ApiController {
  private readonly context = ApiController.name;

  constructor(
    private readonly apiService: ApiService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get('health')
  getHealth() {
    this.loggingService.logApiRequest('GET', '/api/health', this.context);
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
