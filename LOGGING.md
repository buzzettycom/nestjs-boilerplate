# NestJS Logging Guide

This project includes both NestJS's built-in Logger and a custom LoggingService with enhanced features.

## Built-in NestJS Logger

NestJS provides a built-in Logger that automatically includes context prefixes:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  someMethod() {
    this.logger.log('This is an info message');
    this.logger.error('This is an error message');
    this.logger.warn('This is a warning message');
    this.logger.debug('This is a debug message');
    this.logger.verbose('This is a verbose message');
  }
}
```

**Output example:**
```
[Nest] 12345  - 2025/09/19, 10:30:00   LOG [MyService] This is an info message
[Nest] 12345  - 2025/09/19, 10:30:00 ERROR [MyService] This is an error message
```

## Custom LoggingService

The custom LoggingService provides additional features like metadata logging and method tracing:

```typescript
import { Injectable } from '@nestjs/common';
import { LoggingService } from '../shared/logging/logging.service';

@Injectable()
export class MyService {
  private readonly context = MyService.name;

  constructor(private readonly loggingService: LoggingService) {}

  async someMethod(userId: string) {
    // Method entry logging
    this.loggingService.logMethodEntry('someMethod', this.context, { userId });

    try {
      // Info logging with metadata
      this.loggingService.log('Processing user data', this.context, { userId });

      // Database operation logging
      this.loggingService.logDatabaseOperation('SELECT', 'users', this.context, { userId });

      const result = { success: true };

      // Method exit logging
      this.loggingService.logMethodExit('someMethod', this.context, result);
      return result;
    } catch (error) {
      // Error logging with full error object
      this.loggingService.error('Failed to process user', this.context, error as Error, { userId });
      throw error;
    }
  }
}
```

## API Controller Logging

For API controllers, use request/response logging:

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { LoggingService } from '../shared/logging/logging.service';

@Controller('users')
export class UsersController {
  private readonly context = UsersController.name;

  constructor(private readonly loggingService: LoggingService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    this.loggingService.logApiRequest('GET', `/users/${id}`, this.context, { userId: id });
    
    try {
      const user = await this.userService.findById(id);
      this.loggingService.logApiResponse('GET', `/users/${id}`, 200, this.context);
      return user;
    } catch (error) {
      this.loggingService.logApiResponse('GET', `/users/${id}`, 500, this.context);
      throw error;
    }
  }
}
```

## Log Levels

Configure log levels in your environment:

```env
LOG_LEVEL=debug  # error, warn, log, debug, verbose
```

## Available LoggingService Methods

### Basic Logging
- `log(message, context, metadata?)` - Info level
- `error(message, context, error?, metadata?)` - Error level
- `warn(message, context, metadata?)` - Warning level
- `debug(message, context, metadata?)` - Debug level
- `verbose(message, context, metadata?)` - Verbose level

### Method Tracing
- `logMethodEntry(methodName, context, params?)` - Log method entry
- `logMethodExit(methodName, context, result?)` - Log method exit

### Specialized Logging
- `logDatabaseOperation(operation, table, context, metadata?)` - Database operations
- `logApiRequest(method, endpoint, context, metadata?)` - API requests
- `logApiResponse(method, endpoint, statusCode, context, metadata?)` - API responses

## Log Output Examples

**Method tracing:**
```
[Nest] 12345  - 2025/09/19, 10:30:00 DEBUG [AdminService] → getDashboardData() | {"adminId":"123"}
[Nest] 12345  - 2025/09/19, 10:30:01   LOG [AdminService] Dashboard data retrieved successfully | {"totalUsers":150,"activeUsers":120}
[Nest] 12345  - 2025/09/19, 10:30:01 DEBUG [AdminService] ← getDashboardData() | Result: {"totalUsers":150,"activeUsers":120}
```

**Database operations:**
```
[Nest] 12345  - 2025/09/19, 10:30:00   LOG [UserService] DB SELECT on users | {"where":{"id":"123"}}
[Nest] 12345  - 2025/09/19, 10:30:01   LOG [UserService] DB UPDATE on users | {"id":"123","fields":["lastLoginAt"]}
```

**API requests:**
```
[Nest] 12345  - 2025/09/19, 10:30:00   LOG [ApiController] POST /api/login | {"email":"user@example.com"}
[Nest] 12345  - 2025/09/19, 10:30:01   LOG [ApiController] POST /api/login → 200
```

**Error logging:**
```
[Nest] 12345  - 2025/09/19, 10:30:00 ERROR [UserService] Failed to create user: Email already exists | {"email":"user@example.com"}
    at UserService.createUser (/app/src/user/user.service.ts:45:13)
    at UserController.register (/app/src/user/user.controller.ts:23:28)
```

## Best Practices

1. **Use consistent context names**: Use the class name as context
2. **Include relevant metadata**: Add user IDs, request IDs, etc.
3. **Log method entry/exit for complex operations**: Helps with debugging
4. **Log database operations**: Include table names and key conditions
5. **Use appropriate log levels**: 
   - `error` for exceptions and failures
   - `warn` for recoverable issues
   - `log` for normal operations
   - `debug` for detailed tracing
   - `verbose` for very detailed information

6. **Avoid logging sensitive data**: Don't log passwords, tokens, etc.
7. **Use structured logging**: Include metadata objects rather than string interpolation

## Production Configuration

In production, consider:
- Setting LOG_LEVEL to 'log' or 'warn' to reduce noise
- Using external logging services (ELK stack, CloudWatch, etc.)
- Implementing log rotation
- Adding request correlation IDs for tracing requests across services