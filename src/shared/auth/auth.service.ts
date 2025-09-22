import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import type { AuthConfig } from '../../config/auth.config';
import type { User } from '../interfaces';
import type {
  JwtPayload,
  TokenPair,
  LoginCredentials,
  TokenValidationResult,
} from './interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('auth') private readonly authConfig: AuthConfig,
  ) {}

  validateUser(token: string): TokenValidationResult {
    try {
      const publicKey = this.authConfig.apiJwtPublicKey;
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;

      return {
        valid: true,
        payload,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid token',
      };
    }
  }

  generateTokenPair(user: User): TokenPair {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const privateKey = this.authConfig.apiJwtPrivateKey;
    const refreshPrivateKey = this.authConfig.apiJwtRefreshPrivateKey;

    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: this.authConfig.apiJwtExpiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, refreshPrivateKey, {
      algorithm: 'RS256',
      expiresIn: this.authConfig.apiJwtRefreshExpiresIn,
    } as jwt.SignOptions);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.authConfig.apiJwtExpiresIn,
    };
  }

  validateRefreshToken(token: string): TokenValidationResult {
    try {
      const publicKey = this.authConfig.apiJwtRefreshPublicKey;
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;

      return {
        valid: true,
        payload,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid refresh token',
      };
    }
  }

  validateAdminUser(token: string): TokenValidationResult {
    const result = this.validateUser(token);

    if (!result.valid || !result.payload?.isAdmin) {
      return {
        valid: false,
        error: 'Admin access required',
      };
    }

    return result;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.authConfig.bcryptRounds;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateCredentials(
    credentials: LoginCredentials,
    user: User,
  ): Promise<boolean> {
    if (!user.password) {
      return false;
    }

    return this.comparePassword(credentials.password, user.password);
  }

  // Legacy method for backward compatibility
  generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const privateKey = this.authConfig.apiJwtPrivateKey;
    return jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: this.authConfig.apiJwtExpiresIn,
    } as jwt.SignOptions);
  }
}
