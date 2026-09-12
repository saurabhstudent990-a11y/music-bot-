import pino from 'pino';
import { config } from '../config/env';

const isDev = config.NODE_ENV === 'development';

export const logger = pino({
  level: config.LOG_LEVEL,
  base: {
    service: 'sauraxt-music',
    env: config.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export interface LogContext {
  guildId?: string;
  userId?: string;
  sessionId?: string;
  botId?: string;
  requestId?: string;
  command?: string;
  event?: string;
  [key: string]: unknown;
}

export function createChildLogger(context: LogContext) {
  return logger.child(context);
}
