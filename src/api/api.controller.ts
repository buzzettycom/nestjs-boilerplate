import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiService } from './api.service';
import { LoggingService } from '../shared/logging/logging.service';
import type { ContactData } from '../shared/interfaces';

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

  @Get('public/data')
  getPublicData() {
    return this.apiService.getPublicData();
  }

  @Post('contact')
  submitContact(@Body() contactData: ContactData) {
    return this.apiService.submitContact(contactData);
  }
}
