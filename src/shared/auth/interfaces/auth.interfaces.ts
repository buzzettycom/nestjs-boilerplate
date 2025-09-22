export interface JwtPayload {
  sub: string; // subject (user ID)
  email: string;
  isAdmin?: boolean;
  iat?: number; // issued at
  exp?: number; // expires at
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: JwtPayload;
  error?: string;
}
