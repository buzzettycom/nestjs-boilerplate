import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface AuthConfig {
  jwtPrivateKey: string;
  jwtPublicKey: string;
  jwtExpiresIn: string;
  jwtRefreshPrivateKey: string;
  jwtRefreshPublicKey: string;
  jwtRefreshExpiresIn: string;
  bcryptRounds: number;
  sessionSecret: string;
  adminSecret: string;
}

const getPrivateKey = (): string => {
  if (process.env.JWT_PRIVATE_KEY) {
    return process.env.JWT_PRIVATE_KEY;
  }
  try {
    return readFileSync(join(process.cwd(), 'jwt-private.pem'), 'utf8');
  } catch {
    return 'development-private-key-fallback';
  }
};

const getPublicKey = (): string => {
  if (process.env.JWT_PUBLIC_KEY) {
    return process.env.JWT_PUBLIC_KEY;
  }
  try {
    return readFileSync(join(process.cwd(), 'jwt-public.pem'), 'utf8');
  } catch {
    return 'development-public-key-fallback';
  }
};

export default registerAs(
  'auth',
  (): AuthConfig => ({
    jwtPrivateKey: getPrivateKey(),
    jwtPublicKey: getPublicKey(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    jwtRefreshPrivateKey:
      process.env.JWT_REFRESH_PRIVATE_KEY || getPrivateKey(),
    jwtRefreshPublicKey: process.env.JWT_REFRESH_PUBLIC_KEY || getPublicKey(),
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    sessionSecret: process.env.SESSION_SECRET || 'session-secret',
    adminSecret: process.env.ADMIN_SECRET || 'admin-secret-key',
  }),
);
