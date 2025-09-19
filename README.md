# NestJS Boilerplate with Admin & API Services

A scalable NestJS application featuring separate admin and API services with shared modules, TypeORM integration, and environment-based configuration.

## Architecture

### Services
- **Admin Service** (`port 3002`): Administrative interface with user management, settings, and audit logs
- **API Service** (`port 3001`): Public-facing REST API for user interactions  
- **Shared Modules**: Common services (auth, database, utils) used by both services

### Key Features
- 🏗️ **Multi-service architecture** with shared modules
- 🗄️ **TypeORM integration** with PostgreSQL
- 🔐 **JWT authentication** with configurable expiration
- ⚙️ **Environment-based configuration** using @nestjs/config
- 📊 **Database migrations** for schema management
- 🔒 **Type-safe** with full TypeScript support
- 📝 **Admin audit logging** for tracking administrative actions

## Database Schema

### Entities
- **User**: User accounts with authentication and profile data
- **Contact**: Contact form submissions from public API
- **Setting**: System configuration with JSON storage
- **AdminLog**: Audit trail for administrative actions

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

2. Update `.env` with your configuration:
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

# Authentication Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
```

### Installation & Database Setup

1. Install dependencies:
```bash
npm install
```

2. Run database migrations:
```bash
npm run migration:run
```

3. Build the application:
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
- `GET /health` - Health check
- `POST /login` - User login
- `POST /register` - User registration
- `GET /profile/:id` - Get user profile
- `PUT /profile/:id` - Update user profile
- `GET /public` - Get public data
- `POST /contact` - Submit contact form

### Admin Service (Port 3002)
- `GET /dashboard` - Dashboard statistics
- `GET /users` - List all users
- `GET /users/:id` - Get specific user
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /settings` - Get system settings
- `PUT /settings` - Update system settings

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

## Development

### Project Structure
```
src/
├── admin/              # Admin service module
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── admin.module.ts
├── api/                # API service module
│   ├── api.controller.ts
│   ├── api.service.ts
│   └── api.module.ts
├── shared/             # Shared modules
│   ├── auth/           # Authentication service
│   ├── database/       # Database service
│   ├── utils/          # Utility functions
│   ├── entities/       # TypeORM entities
│   └── interfaces/     # TypeScript interfaces
├── config/             # Configuration modules
├── migrations/         # Database migrations
└── main.ts            # Application entry point
```

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

## Security Considerations

- Change `JWT_SECRET` in production
- Use strong database passwords
- Enable HTTPS in production
- Configure CORS properly
- Validate all input data
- Implement rate limiting
- Use environment variables for secrets

## License

This project is licensed under the MIT License.
