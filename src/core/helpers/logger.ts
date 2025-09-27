import pino from 'pino';

export const pinoLogger = pino({
  level: Bun.env.NODE_ENV === 'production' ? 'info' : 'debug',
}, pino.destination('./logs/app.log'));