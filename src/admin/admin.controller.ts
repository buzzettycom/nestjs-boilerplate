import { Controller, Get, Put, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import type { AdminSettings } from '../shared/interfaces';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  updateSettings(@Body() settings: AdminSettings) {
    return this.adminService.updateSettings(settings);
  }
}
