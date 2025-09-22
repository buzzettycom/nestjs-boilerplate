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
export class ApiAuthService {
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

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.authConfig.bcryptRounds);
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

  generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return jwt.sign(payload, this.authConfig.apiJwtPrivateKey, {
      algorithm: 'RS256',
      expiresIn: this.authConfig.apiJwtExpiresIn,
    } as jwt.SignOptions);
  }
}
