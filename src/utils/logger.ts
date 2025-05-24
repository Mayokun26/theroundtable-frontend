/**
 * Frontend logger utility following project standards
 * Provides consistent error handling and logging across the frontend
 */

interface LoggerOptions {
  level: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log an error with consistent formatting and metadata
   * @param message - The error message
   * @param metadata - Additional context about the error
   */
  error(message: string, metadata?: Record<string, unknown>): void {
    console.error('[ERROR]', message, metadata);
    // In development, we could also send errors to a monitoring service
  }

  /**
   * Log an informational message
   * @param message - The info message
   * @param metadata - Additional context
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[INFO]', message, metadata);
    }
  }

  /**
   * Log a warning message
   * @param message - The warning message
   * @param metadata - Additional context
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    console.warn('[WARN]', message, metadata);
  }
}

export const logger = Logger.getInstance();
