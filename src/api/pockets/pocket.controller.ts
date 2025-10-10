import { honoApp } from '@/core/lib/hono';
import { CreatePocketCase, ListPocketCase } from './pocket.case';
import { zValidator } from '@hono/zod-validator';
import { createPocketSchema, pocketFilterSchema } from './pocket.schema';
import { createSpendingPocketSchema } from './spending/spending-pocket.schema';
import { CreateSpendingPocketCase } from './spending/spending-pocket.case';

const controller = honoApp();

controller.get('/', zValidator('query', pocketFilterSchema), async (c) => {
  const user = c.get('user');
  const query = c.req.valid('query');
  const pockets = await ListPocketCase.execute(user, query);
  return c.json(pockets);
});

controller.post('/', zValidator('json', createPocketSchema), async (c) => {
  const user = c.get('user');
  const payload = c.req.valid('json');
  const pocket = await CreatePocketCase.execute(user, payload);
  return c.json(pocket);
});

controller.post('/spendings', zValidator('json', createSpendingPocketSchema), async (c) => {
  const user = c.get('user');
  const payload = c.req.valid('json');
  const spendingPocket = await CreateSpendingPocketCase.execute(user, payload);
  return c.json(spendingPocket);
});

export const pocketController = controller;
