import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly loggers = new Map<string, Logger>();

  private getLogger(context: string): Logger {
    if (!this.loggers.has(context)) {
      this.loggers.set(context, new Logger(context));
    }
    return this.loggers.get(context)!;
  }

  /**
   * Log an informational message
   */
  log(
    message: string,
    context: string,
    metadata?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const logMessage = metadata
      ? `${message} | ${JSON.stringify(metadata)}`
      : message;
    logger.log(logMessage);
  }

  /**
   * Log an error message
   */
  error(
    message: string,
    context: string,
    error?: Error,
    metadata?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const logMessage = metadata
      ? `${message} | ${JSON.stringify(metadata)}`
      : message;
    logger.error(logMessage, error?.stack);
  }

  /**
   * Log a warning message
   */
  warn(
    message: string,
    context: string,
    metadata?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const logMessage = metadata
      ? `${message} | ${JSON.stringify(metadata)}`
      : message;
    logger.warn(logMessage);
  }

  /**
   * Log a debug message
   */
  debug(
    message: string,
    context: string,
    metadata?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const logMessage = metadata
      ? `${message} | ${JSON.stringify(metadata)}`
      : message;
    logger.debug(logMessage);
  }

  /**
   * Log a verbose message
   */
  verbose(
    message: string,
    context: string,
    metadata?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const logMessage = metadata
      ? `${message} | ${JSON.stringify(metadata)}`
      : message;
    logger.verbose(logMessage);
  }

  /**
   * Log a method entry
   */
  logMethodEntry(
    methodName: string,
    context: string,
    params?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const message = params
      ? `→ ${methodName}() | ${JSON.stringify(params)}`
      : `→ ${methodName}()`;
    logger.debug(message);
  }

  /**
   * Log a method exit
   */
  logMethodExit(methodName: string, context: string, result?: any): void {
    const logger = this.getLogger(context);
    const message =
      result !== undefined
        ? `← ${methodName}() | Result: ${typeof result === 'object' ? JSON.stringify(result) : result}`
        : `← ${methodName}()`;
    logger.debug(message);
  }

  /**
   * Log a database operation
   */
  logDatabaseOperation(
    operation: string,
    table: string,
    context: string,
    metadata?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const message = metadata
      ? `DB ${operation} on ${table} | ${JSON.stringify(metadata)}`
      : `DB ${operation} on ${table}`;
    logger.log(message);
  }

  /**
   * Log an API request
   */
  logApiRequest(
    method: string,
    endpoint: string,
    context: string,
    metadata?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const message = metadata
      ? `${method} ${endpoint} | ${JSON.stringify(metadata)}`
      : `${method} ${endpoint}`;
    logger.log(message);
  }

  /**
   * Log an API response
   */
  logApiResponse(
    method: string,
    endpoint: string,
    statusCode: number,
    context: string,
    metadata?: Record<string, any>,
  ): void {
    const logger = this.getLogger(context);
    const message = metadata
      ? `${method} ${endpoint} → ${statusCode} | ${JSON.stringify(metadata)}`
      : `${method} ${endpoint} → ${statusCode}`;
    logger.log(message);
  }
}