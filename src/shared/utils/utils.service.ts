import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}
