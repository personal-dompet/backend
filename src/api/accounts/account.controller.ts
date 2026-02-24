import { App } from '@/core/lib/hono';
import { Drizzle } from 'db';
import { AccountRepository } from './account.repository';
import { zValidator } from '@hono/zod-validator';
import { accountInsertSchema } from './account.schema';

const controller = new App();

const drizzle = Drizzle.instance;
const repository = new AccountRepository(drizzle);

controller.get('/', async (context) => {
  const user = context.get('user');

  const accounts = repository.list(user);

  return context.json(accounts);
})

controller.post('/', zValidator('json', accountInsertSchema), async (context) => {
  const user = context.get('user');
  const payload = context.req.valid('json');

  const account = repository.create(user, payload);

  return context.json(account);
})

export const accountController = controller;
