import { logger } from 'hono/logger'
import { auth } from './firebase-admin';
import { User } from './utils/entities/user-entity';
import { honoApp } from './utils/lib/hono';
import { walletController } from './api/wallets/wallet.controller';
import { transactionController } from './api/transactions/transaction.controller';
import { pocketController } from './api/pockets/pocket.controller';
import { showRoutes } from 'hono/dev';
import { errorHandler } from './utils/helpers/error-handler';
import { accountController } from './api/accounts/account.controller';


const app = honoApp();

app.use(logger((message: string, ...rest: string[]) => {
  console.log(message, ...rest)
}));

app.onError(errorHandler);


app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'No token provided' }, 401);
  }

  const idToken = authHeader.substring(7);

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    c.set<'user'>('user', new User(decodedToken));

    await next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return c.json({ error: 'Invalid token' }, 401);
  }
});

app.route('/api/wallets', walletController);
app.route('/api/transactions', transactionController);
app.route('/api/pockets', pocketController);
app.route('/api/accounts', accountController);

showRoutes(app, { colorize: true });

export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  host: process.env.HOST || '0.0.0.0',
  fetch: app.fetch,
}
