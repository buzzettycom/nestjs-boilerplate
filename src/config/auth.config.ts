import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface AuthConfig {
  // API JWT Keys
  apiJwtPrivateKey: string;
  apiJwtPublicKey: string;
  apiJwtExpiresIn: string;
  apiJwtRefreshPrivateKey: string;
  apiJwtRefreshPublicKey: string;
  apiJwtRefreshExpiresIn: string;

  // Admin JWT Keys
  adminJwtPrivateKey: string;
  adminJwtPublicKey: string;
  adminJwtExpiresIn: string;
  adminJwtRefreshPrivateKey: string;
  adminJwtRefreshPublicKey: string;
  adminJwtRefreshExpiresIn: string;

  // Shared settings
  bcryptRounds: number;
  sessionSecret: string;
  adminSecret: string;
}

const getApiPrivateKey = (): string => {
  if (process.env.API_JWT_PRIVATE_KEY) {
    return process.env.API_JWT_PRIVATE_KEY;
  }
  try {
    return readFileSync(join(process.cwd(), 'jwt-api-private.pem'), 'utf8');
  } catch {
    return 'development-api-private-key-fallback';
  }
};

const getApiPublicKey = (): string => {
  if (process.env.API_JWT_PUBLIC_KEY) {
    return process.env.API_JWT_PUBLIC_KEY;
  }
  try {
    return readFileSync(join(process.cwd(), 'jwt-api-public.pem'), 'utf8');
  } catch {
    return 'development-api-public-key-fallback';
  }
};

const getAdminPrivateKey = (): string => {
  if (process.env.ADMIN_JWT_PRIVATE_KEY) {
    return process.env.ADMIN_JWT_PRIVATE_KEY;
  }
  try {
    return readFileSync(join(process.cwd(), 'jwt-admin-private.pem'), 'utf8');
  } catch {
    return 'development-admin-private-key-fallback';
  }
};

const getAdminPublicKey = (): string => {
  if (process.env.ADMIN_JWT_PUBLIC_KEY) {
    return process.env.ADMIN_JWT_PUBLIC_KEY;
  }
  try {
    return readFileSync(join(process.cwd(), 'jwt-admin-public.pem'), 'utf8');
  } catch {
    return 'development-admin-public-key-fallback';
  }
};

export default registerAs(
  'auth',
  (): AuthConfig => ({
    // API JWT Configuration
    apiJwtPrivateKey: getApiPrivateKey(),
    apiJwtPublicKey: getApiPublicKey(),
    apiJwtExpiresIn:
      process.env.API_JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '1h',
    apiJwtRefreshPrivateKey:
      process.env.API_JWT_REFRESH_PRIVATE_KEY || getApiPrivateKey(),
    apiJwtRefreshPublicKey:
      process.env.API_JWT_REFRESH_PUBLIC_KEY || getApiPublicKey(),
    apiJwtRefreshExpiresIn:
      process.env.API_JWT_REFRESH_EXPIRES_IN ||
      process.env.JWT_REFRESH_EXPIRES_IN ||
      '7d',

    // Admin JWT Configuration
    adminJwtPrivateKey: getAdminPrivateKey(),
    adminJwtPublicKey: getAdminPublicKey(),
    adminJwtExpiresIn:
      process.env.ADMIN_JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '1h',
    adminJwtRefreshPrivateKey:
      process.env.ADMIN_JWT_REFRESH_PRIVATE_KEY || getAdminPrivateKey(),
    adminJwtRefreshPublicKey:
      process.env.ADMIN_JWT_REFRESH_PUBLIC_KEY || getAdminPublicKey(),
    adminJwtRefreshExpiresIn:
      process.env.ADMIN_JWT_REFRESH_EXPIRES_IN ||
      process.env.JWT_REFRESH_EXPIRES_IN ||
      '7d',

    // Shared Configuration
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    sessionSecret: process.env.SESSION_SECRET || 'session-secret',
    adminSecret: process.env.ADMIN_SECRET || 'admin-secret-key',
  }),
);
