export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

export type LoggerConfig = {
  level: LogLevel;
  environment: "browser" | "node";
  enabled: boolean;
  logToConsole?: boolean;
  format?: "plain" | "json";
};

const defaultConfig: LoggerConfig = {
  level: LogLevel.INFO,
  environment: typeof window === "undefined" ? "node" : "browser",
  enabled: true,
  logToConsole: true,
  format: "plain",
};

export class Logger {
  private config: LoggerConfig;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level >= this.config.level;
  }

  private formatMessage(level: LogLevel, message: string, context?: unknown): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    let contextString = "";
    if (context) {
      if (context instanceof Error) {
        contextString = context.stack || context.message;
      } else if (typeof context === "object") {
        try {
          contextString = JSON.stringify(context);
        } catch {
          contextString = String(context);
        }
      } else {
        contextString = String(context);
      }
    }
    return `[${timestamp}]\t[${levelName}]\t${message}\t${contextString}`;
  }

  private writeToConsole(formattedMessage: string, level: LogLevel): void {
    if (!this.config.logToConsole) return;
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage);
        break;
    }
  }

  private log(level: LogLevel, message: string, context?: unknown): void {
    if (!this.shouldLog(level)) return;
    const formattedMessage = this.formatMessage(level, message, context);
    this.writeToConsole(formattedMessage, level);
  }

  debug(message: string, context?: unknown): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: unknown): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: unknown): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: unknown): void {
    this.log(LogLevel.ERROR, message, context);
  }

  fatal(message: string, context?: unknown): void {
    this.log(LogLevel.FATAL, message, context);
  }

  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const logger = new Logger();
export default Logger;
