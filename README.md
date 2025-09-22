# 🚀 NestJS Enterprise Boilerplate

> **Production-ready NestJS boilerplate with modular architecture, dual JWT authentication, and enterprise-grade security**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

## ✨ Why Choose This Boilerplate?

**Perfect for freelancers, startups, and enterprise teams** who need to ship production-ready APIs fast without compromising on security or scalability.

### 🎯 **What Makes It Special**

- **⚡ Rapid Development** - Start building features in minutes, not hours
- **🛡️ Enterprise Security** - RS256 JWT with separate API/Admin authentication
- **🏗️ Modular Architecture** - Clean, scalable code organization
- **🔧 Production Ready** - Environment configs, logging, validation, and more
- **📊 TypeORM Integration** - Database migrations and entity management
- **🧪 Testing Setup** - Unit and E2E tests configured and ready

### 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/buzzettycom/nestjs-boilerplate.git
cd nestjs-enterprise-boilerplate

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Generate JWT keys
./generate-jwt-keys.sh

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

Your API will be running at:
- **Main App**: http://localhost:3000
- **API Routes**: http://localhost:3000/api
- **Admin Routes**: http://localhost:3000/admin

---

## 🌟 Key Features

### 🔐 **Dual Authentication System**
- **API Service**: Public-facing REST API with user authentication
- **Admin Service**: Secure admin panel with enhanced permissions
- **Separate JWT Keys**: Different RSA key pairs for enhanced security isolation
- **RS256 Algorithm**: Industry-standard asymmetric key encryption

### 🏗️ **Enterprise Architecture**
- **Modular Design**: Feature-based modules for scalable development
- **TypeORM Integration**: Robust database layer with migrations
- **Environment Configuration**: Separate configs for development, staging, and production
- **Logging System**: Comprehensive logging with context-based loggers

### 🛡️ **Production Security**
- **Input Validation**: Class-validator with DTO pattern
- **Password Security**: Bcrypt hashing with configurable rounds
- **CORS Protection**: Environment-based origin configuration
- **Security Headers**: Ready for helmet.js integration

### 🔧 **Developer Experience**
- **Hot Reload**: Instant development feedback
- **Testing Ready**: Unit and E2E test infrastructure
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode
- **Database Tools**: Migration generation and management scripts

---


### 📋  Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Main application port | `3000` |
| `API_PORT` | API service port | `3001` |
| `ADMIN_PORT` | Admin service port | `3002` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `DB_DATABASE` | Database name | `nestjs_app` |
| `JWT_PRIVATE_KEY` | RSA private key for JWT signing | `jwt-private.pem` |
| `JWT_PUBLIC_KEY` | RSA public key for JWT verification | `jwt-public.pem` |
| `JWT_EXPIRES_IN` | Access token expiration time | `1h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `10` |
| `SESSION_SECRET` | Session secret key | - |
| `ADMIN_SECRET` | Admin authentication secret | - |cture

### Services
- **API Service** (`port 3001`): Public-facing REST API with modular feature organization:
  - Core API: Health checks, public data, contact forms
  - Users Module: Authentication, registration, profile management
- **Admin Service** (`port 3002`): Administrative interface with specialized modules:
  - Dashboard Module: System monitoring and statistics
  - Admin Users Module: User CRUD operations and management
  - Core Admin: Settings management and audit logging
- **Shared Modules**: Common services (auth, database, utils) used across all modules

### Key Features
- 🏗️ **Modular architecture** with feature-based modules for better organization
- 📦 **Clean separation of concerns** - each module handles a specific domain
- � **Separate JWT authentication** with different RSA key pairs for API and Admin services
- �️ **TypeORM integration** with PostgreSQL and snake_case fields
- ⚙️ **Environment-based configuration** using @nestjs/config
- 📊 **Database migrations** for schema management
- 🔒 **Type-safe** with full TypeScript support
- 📝 **Admin audit logging** for tracking administrative actions
- 🔑 **Secure password hashing** with bcrypt
- 🧪 **Testable modules** that can be developed and tested independently
- 👥 **Team-friendly** structure for multiple developers

## Database Schema

The database follows PostgreSQL best practices with **snake_case** field naming convention.

### Entities
- **User**: User accounts with authentication and profile data
  - Fields: `id`, `email`, `name`, `password`, `profile`, `is_active`, `is_admin`, `last_login_at`, `created_at`, `updated_at`
- **Contact**: Contact form submissions from public API
  - Fields: `id`, `email`, `name`, `subject`, `message`, `status`, `response`, `responded_at`, `created_at`, `updated_at`
- **Setting**: System configuration with JSON storage
  - Fields: `id`, `key`, `value`, `description`, `is_public`, `data_type`, `created_at`, `updated_at`
- **AdminLog**: Audit trail for administrative actions
  - Fields: `id`, `admin_id`, `action`, `resource`, `resource_id`, `details`, `ip_address`, `user_agent`, `created_at`

### Field Naming Convention
- **Database**: snake_case (e.g., `is_active`, `created_at`, `admin_id`)
- **TypeScript**: camelCase (e.g., `isActive`, `createdAt`, `adminId`)
- **Mapping**: Automatic conversion using TypeORM `@Column({ name: 'snake_case' })` decorators

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Generate separate RSA key pairs for API and Admin JWT authentication:
```bash
# Use the provided script to generate all key pairs
./generate-jwt-keys.sh

# Or generate manually:
# API JWT keys
openssl genrsa -out jwt-api-private.pem 2048
openssl rsa -in jwt-api-private.pem -pubout -out jwt-api-public.pem

# Admin JWT keys
openssl genrsa -out jwt-admin-private.pem 2048
openssl rsa -in jwt-admin-private.pem -pubout -out jwt-admin-public.pem
```

3. Update `.env` with your configuration:
```env
# Application Configuration
NODE_ENV=development
PORT=3000
API_PORT=3001
ADMIN_PORT=3002

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=nestjs_app

# API JWT Configuration (Separate keys for API service)
# The system will automatically load jwt-api-private.pem and jwt-api-public.pem
# Or you can set them as environment variables:
# API_JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
# API_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
API_JWT_EXPIRES_IN=1h
API_JWT_REFRESH_EXPIRES_IN=7d

# Admin JWT Configuration (Separate keys for Admin service)
# The system will automatically load jwt-admin-private.pem and jwt-admin-public.pem
# Or you can set them as environment variables:
# ADMIN_JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
# ADMIN_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
ADMIN_JWT_EXPIRES_IN=1h
ADMIN_JWT_REFRESH_EXPIRES_IN=7d

# Shared Configuration
BCRYPT_ROUNDS=10
SESSION_SECRET=your-session-secret-key
ADMIN_SECRET=your-admin-secret-key
```

### Installation & Database Setup

1. Install dependencies:
```bash
npm install
```

2. Generate RSA keys for JWT authentication:
```bash
# Generate RSA private key (2048-bit)
openssl genrsa -out jwt-private.pem 2048

# Generate public key from private key
openssl rsa -in jwt-private.pem -pubout -out jwt-public.pem
```

3. Run database migrations:
```bash
npm run migration:run
```

4. Build the application:
```bash
npm run build
```

### Running the Application

#### Development Mode
```bash
# Start both services in development mode
npm run start:both

# Or start services individually
npm run start:admin:dev  # Admin service on port 3002
npm run start:api:dev    # API service on port 3001
```

#### Production Mode
```bash
# Build and start both services
npm run build
npm run start:admin:prod &
npm run start:api:prod &
```

## API Endpoints

### API Service (Port 3001)

#### Core API Module
- `GET /api/health` - Health check
- `GET /api/public/data` - Get public data
- `POST /api/contact` - Submit contact form

#### Users Module (`/api/users`)
- `POST /api/users/auth/login` - User login
- `POST /api/users/auth/register` - User registration
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile

### Admin Service (Port 3002)

#### Core Admin Module
- `GET /admin/settings` - Get system settings
- `PUT /admin/settings` - Update system settings

#### Dashboard Module (`/admin/dashboard`)
- `GET /admin/dashboard/data` - Dashboard statistics
- `GET /admin/dashboard/health` - System health check

#### Admin Users Module (`/admin/users`)
- `GET /admin/users` - List all users (with pagination and search)
- `GET /admin/users/:id` - Get specific user
- `POST /admin/users` - Create new user
- `PUT /admin/users/:id` - Update user
- `PUT /admin/users/:id/toggle-status` - Toggle user active status
- `DELETE /admin/users/:id` - Delete user

## Database Management

### Migration Commands
```bash
# Generate new migration
npm run migration:generate -- --name MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show

# Sync database schema (dev only)
npm run schema:sync

# Drop database schema (dev only)
npm run schema:drop
```

### Sample Data
The initial migration includes sample data:
- Admin user with JWT authentication
- System settings (siteName, maintenanceMode, etc.)
- Sample contact entries

**Note**: The migration system is configured to automatically load environment variables from `.env` file using the `dotenv` package.

## JWT Authentication System

This boilerplate implements a robust JWT authentication system using **RS256 algorithm** with separate RSA key pairs for enhanced security between API and Admin services.

### Separate Authentication Systems
- **API Service**: Uses dedicated API JWT keys for public user authentication
- **Admin Service**: Uses separate Admin JWT keys for administrative access
- **Enhanced Security**: Complete isolation between API and Admin authentication systems
- **Independent Key Rotation**: Update keys for each service independently

### Authentication Features
- **RS256 Algorithm**: Asymmetric encryption using RSA key pairs
- **Separate Key Pairs**: Different keys for API and Admin services
- **Access & Refresh Tokens**: Separate tokens with different expiration times
- **Password Security**: Bcrypt hashing with configurable rounds
- **Admin Authorization**: Separate validation for administrative users
- **Type Safety**: Full TypeScript support with comprehensive interfaces

### Key Generation
```bash
# Generate all key pairs using the provided script
./generate-jwt-keys.sh

# Or generate manually:
# API JWT keys (2048-bit RSA)
openssl genrsa -out jwt-api-private.pem 2048
openssl rsa -in jwt-api-private.pem -pubout -out jwt-api-public.pem

# Admin JWT keys (2048-bit RSA)
openssl genrsa -out jwt-admin-private.pem 2048
openssl rsa -in jwt-admin-private.pem -pubout -out jwt-admin-public.pem

# View key contents (for environment variables)
cat jwt-api-private.pem
cat jwt-admin-private.pem
```

### AuthService Methods
```typescript
// API Authentication Service (ApiAuthService)
generateTokenPair(user: User): TokenPair  // API tokens
validateUser(token: string): TokenValidationResult
validateRefreshToken(token: string): TokenValidationResult
hashPassword(password: string): Promise<string>
comparePassword(password: string, hash: string): Promise<boolean>
validateCredentials(credentials: LoginCredentials, user: User): Promise<boolean>

// Admin Authentication Service (AdminAuthService)
generateTokenPair(user: User): TokenPair  // Admin tokens (requires isAdmin)
validateUser(token: string): TokenValidationResult
validateAdminUser(token: string): TokenValidationResult  // Admin-specific validation
validateRefreshToken(token: string): TokenValidationResult
hashPassword(password: string): Promise<string>
comparePassword(password: string, hash: string): Promise<boolean>
validateCredentials(credentials: LoginCredentials, user: User): Promise<boolean>
```

### Token Structure
```typescript
interface JwtPayload {
  sub: string;        // User ID
  email: string;      // User email
  isAdmin?: boolean;  // Admin flag
  iat?: number;       // Issued at
  exp?: number;       // Expires at
}

interface TokenPair {
  accessToken: string;   // Short-lived access token
  refreshToken: string;  // Long-lived refresh token
  expiresIn: string;     // Access token expiration time
}
```

### Security Benefits
- **Service Isolation**: Complete separation between API and Admin authentication
- **Asymmetric Keys**: Public key for verification, private key for signing
- **Independent Key Management**: Rotate keys for each service independently
- **Token Separation**: Different keys for access and refresh tokens
- **No Shared Secrets**: Eliminates risks associated with symmetric keys
- **Signature Verification**: Cryptographic proof of token authenticity
- **Configurable Expiration**: Separate lifetimes for different token types
- **Admin Validation**: Enhanced security checks for administrative access

## Development

### Project Structure
```
src/
├── admin/              # Admin service with modular features
│   ├── dashboard/      # Dashboard module
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.service.ts
│   │   └── dashboard.module.ts
│   ├── users/          # Admin user management module
│   │   ├── admin-users.controller.ts
│   │   ├── admin-users.service.ts
│   │   └── admin-users.module.ts
│   ├── admin.controller.ts  # Core admin (settings)
│   ├── admin.service.ts     # Core admin functionality
│   └── admin.module.ts      # Main admin module
├── api/                # API service with modular features
│   ├── users/          # User authentication module
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── api.controller.ts    # Core API (health, public, contact)
│   ├── api.service.ts       # Core API functionality
│   └── api.module.ts        # Main API module
├── shared/             # Shared modules
│   ├── auth/           # Authentication service
│   ├── database/       # Database service
│   ├── utils/          # Utility functions
│   ├── logging/        # Logging service
│   ├── entities/       # TypeORM entities
│   └── interfaces/     # TypeScript interfaces
├── config/             # Configuration modules
├── migrations/         # Database migrations
└── main.ts            # Application entry point
```

### Adding New Modules

This project follows a modular architecture pattern. To add a new feature module:

1. **Create module directory** in appropriate service folder:
```bash
mkdir -p src/api/your-feature    # For API features
# or
mkdir -p src/admin/your-feature  # For Admin features
```

2. **Create module files**:
```typescript
// your-feature.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YourEntity } from '../../shared/entities';

@Injectable()
export class YourFeatureService {
  constructor(
    @InjectRepository(YourEntity)
    private readonly yourRepository: Repository<YourEntity>,
  ) {}
  
  // Service methods here
}

// your-feature.controller.ts
import { Controller, Get } from '@nestjs/common';
import { YourFeatureService } from './your-feature.service';

@Controller('your-feature')
export class YourFeatureController {
  constructor(private readonly yourFeatureService: YourFeatureService) {}
  
  // Controller endpoints here
}

// your-feature.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YourFeatureController } from './your-feature.controller';
import { YourFeatureService } from './your-feature.service';
import { YourEntity } from '../../shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([YourEntity])],
  controllers: [YourFeatureController],
  providers: [YourFeatureService],
  exports: [YourFeatureService],
})
export class YourFeatureModule {}
```

3. **Import module** in parent module:
```typescript
// In api.module.ts or admin.module.ts
import { YourFeatureModule } from './your-feature/your-feature.module';

@Module({
  imports: [
    // ... other imports
    YourFeatureModule,
  ],
  // ...
})
export class ApiModule {} // or AdminModule
```

### Module Architecture Benefits

- **🎯 Single Responsibility**: Each module handles one specific feature/domain
- **🔧 Maintainability**: Easy to locate and modify feature-specific code
- **🧪 Testability**: Modules can be tested in isolation
- **📈 Scalability**: Add new features without affecting existing code
- **👥 Team Development**: Multiple developers can work on different modules
- **🔄 Reusability**: Modules can be easily reused or extracted
- **🛡️ Encapsulation**: Internal module logic is properly encapsulated

### Adding New Entities

1. Create entity file in `src/shared/entities/`:
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('your_entity')
export class YourEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
```

2. Export entity in `src/shared/entities/index.ts`
3. Generate migration: `npm run migration:generate -- --name AddYourEntity`
4. Run migration: `npm run migration:run`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Main application port | `3000` |
| `API_PORT` | API service port | `3001` |
| `ADMIN_PORT` | Admin service port | `3002` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `DB_DATABASE` | Database name | `nestjs_app` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `1h` |

## Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Production Deployment

### Database Setup
1. Create PostgreSQL database
2. Set environment variables
3. Run migrations: `npm run migration:run`
4. Start services

## 🎯 Perfect For

### 💼 **Freelancers & Agencies**
- **Client Projects**: Impress clients with professional architecture
- **Rapid Delivery**: Ship MVPs in days, not weeks
- **Maintenance**: Clean code that's easy to extend and maintain

### 🚀 **Startups**
- **MVP Development**: Get to market faster with proven architecture
- **Scalability**: Built to grow from prototype to enterprise
- **Team Onboarding**: Well-documented, easy for new developers

### 🏢 **Enterprise Teams**
- **Internal Tools**: Admin panels and internal APIs
- **Microservices**: Foundation for service-oriented architecture
- **Compliance**: Security-first approach for sensitive applications

### 📚 **Learning & Portfolio**
- **Best Practices**: Learn enterprise-grade NestJS patterns
- **Portfolio Projects**: Showcase professional development skills
- **Educational**: Perfect for tutorials and teaching materials

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [TypeORM](https://typeorm.io/) - Amazing ORM for TypeScript
- All the amazing open-source contributors who make projects like this possible

---

## Security Considerations

- **Generate separate RSA keys** for API and Admin services in production environments
- **Never commit RSA keys** to version control (they're in .gitignore)
- Use **strong database passwords** and enable SSL/TLS
- Enable **HTTPS in production** for secure token transmission
- Configure **CORS properly** for your domain
- **Validate all input data** and implement request sanitization
- Implement **rate limiting** to prevent brute force attacks
- Use **environment variables** for all secrets
- Store RSA keys securely (consider using key management services)
- Regularly **rotate JWT keys** independently for each service
- Use strong **session and admin secrets**
- **Monitor token usage** and implement proper logging for security events
- Consider **shorter token lifetimes** for Admin services in production

## License

This project is licensed under the MIT License.
