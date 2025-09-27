import { honoApp } from '@/core/lib/hono';
import { CreateAccountCase, ListAccountCase } from './account.case';
import { zValidator } from '@hono/zod-validator';
import { createAccountSchema, accountFilterSchema } from './account.schema';

const controller = honoApp();

controller.get('/', zValidator('query', accountFilterSchema), async (c) => {
  const user = c.get('user');
  const query = c.req.valid('query');
  const accounts = await ListAccountCase.execute(user, query);
  return c.json(accounts);
});

controller.post('/', zValidator('json', createAccountSchema), async (c) => {
  const user = c.get('user');
  const payload = c.req.valid('json');
  const account = await CreateAccountCase.execute(user, payload);
  return c.json(account);
});

export const accountController = controller;
