import { logger } from 'hono/logger';
import { errorHandler } from './core/helpers/error-handler';
import { showRoutes } from 'hono/dev';
import { pocketController } from './api/pockets/pocket.controller';
import { auth } from './firebase-admin';
import { App } from './core/lib/hono';
import { accountController } from './api/accounts/account.controller';
import { financialActivityController } from './api/financial-activities/financial-activity.controller';

const app = new App()

app.use(
  logger((message: string, ...rest: string[]) => {
    console.log(message, ...rest);
  }),
);

app.onError(errorHandler);

app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'No token provided' }, 401);
  }

  const idToken = authHeader.substring(7);

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    c.set<'user'>('user', decodedToken);

    await next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return c.json({ error: 'Invalid token' }, 401);
  }
});

app.route('/api/pockets', pocketController);
app.route('/api/accounts', accountController);
app.route('/api/financial-activities', financialActivityController);

showRoutes(app, { colorize: true });

export const testApp = app;

export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  host: process.env.HOST || '0.0.0.0',
  fetch: app.fetch,
};
