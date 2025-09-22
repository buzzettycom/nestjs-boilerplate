# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-22

### Added
- 🚀 Initial release of NestJS Enterprise Boilerplate
- 🏗️ Modular architecture with feature-based organization
- 🛡️ Dual JWT authentication system (RS256) for API and Admin services
- 📊 TypeORM integration with PostgreSQL support
- 🔧 Environment-based configuration management
- 🧪 Testing infrastructure (Unit + E2E tests)
- 📝 Input validation with class-validator
- 📋 Database migrations and seeding
- 🔍 Comprehensive logging system
- 🌐 CORS configuration
- 📚 Complete documentation and setup guides
- 🐳 Production-ready environment configurations

### Features
- **Authentication**: Separate JWT systems for API and Admin with RSA key pairs
- **Database**: TypeORM with migration support and optimized entity relationships
- **Security**: Password hashing, input validation, and secure token handling
- **Architecture**: Clean modular design for scalable applications
- **Development**: Hot reload, debugging, and comprehensive scripts
- **Production**: Environment configurations and deployment-ready setup

### Security
- RS256 JWT tokens with separate private/public key pairs
- Bcrypt password hashing with configurable rounds
- Input validation and sanitization
- CORS protection with environment-based origins
- Secure session management