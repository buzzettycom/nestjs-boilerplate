import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AuthConfig } from '../../config/auth.config';
import type { User } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('auth') private readonly authConfig: AuthConfig,
  ) {}

  validateUser(token: string): boolean {
    // Shared authentication logic using JWT secret from config
    const jwtSecret = this.configService.get<string>('auth.jwtSecret');
    console.log(
      `Validating token with secret: ${jwtSecret?.substring(0, 10)}...`,
    );

    // Mock validation - replace with actual JWT validation
    return token.length > 0;
  }

  generateToken(user: User): string {
    // Shared token generation logic using config
    const jwtSecret = this.configService.get<string>('auth.jwtSecret');
    const expiresIn = this.configService.get<string>('auth.jwtExpiresIn');
    console.log(
      `Generating token for user ${user.id}, expires in: ${expiresIn}`,
    );

    // Mock token generation - replace with actual JWT generation
    return `token-${jwtSecret?.substring(0, 5)}-${user.id}-${Date.now()}`;
  }

  validateAdminUser(token: string): boolean {
    // Admin-specific validation logic using admin secret
    const adminSecret = this.configService.get<string>('auth.adminSecret');
    console.log(
      `Admin validation with secret: ${adminSecret?.substring(0, 10)}...`,
    );
    return this.validateUser(token);
  }
}
