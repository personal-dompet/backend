import pino from 'pino';

export const pinoLogger = pino({
  level: Bun.env.NODE_ENV === 'production' ? 'error' : 'debug',
}, pino.destination('./logs/app.log'));