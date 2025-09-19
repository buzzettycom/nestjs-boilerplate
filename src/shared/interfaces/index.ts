// User related interfaces
export interface User {
  id: string;
  email: string;
  name?: string;
  profile?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreateData {
  email: string;
  name?: string;
  password?: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  profile?: Record<string, any>;
}

// Authentication interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

// Contact form interface
export interface ContactData {
  email: string;
  message: string;
  name?: string;
  subject?: string;
}

// API response interfaces
export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export interface PublicDataResponse {
  message: string;
  features: string[];
  timestamp: string;
}

// Admin interfaces
export interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  timestamp: string;
}

export interface AdminSettings {
  siteName?: string;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  maxUsers?: number;
}

// Database result interface
export interface DatabaseResult {
  success: boolean;
  data?: any[];
  affectedRows?: number;
  insertId?: string;
}