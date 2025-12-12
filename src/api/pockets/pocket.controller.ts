import { honoApp } from '@/core/lib/hono';
import { CreatePocketCase, DetailPocketCase, ListPocketCase } from './pocket.case';
import { zValidator } from '@hono/zod-validator';
import { createPocketSchema, detailPocketParamSchema, pocketFilterSchema } from './pocket.schema';
import { createSpendingPocketSchema } from './spending/spending-pocket.schema';
import { CreateSpendingPocketCase } from './spending/spending-pocket.case';
import { createRecurringPocketSchema } from './recurring/recurring-pocket.schema';
import { CreateRecurringPocketCase } from './recurring/recurring-pocket.case';
import { createSavingPocketSchema } from './saving/saving-pocket.schema';
import { CreateSavingPocketCase } from './saving/saving-pocket.case';

const controller = honoApp();

controller.get('/', zValidator('query', pocketFilterSchema), async (c) => {
  const user = c.get('user');
  const query = c.req.valid('query');
  const pockets = await ListPocketCase.execute(user, query);
  return c.json(pockets);
});

controller.get('/:id', zValidator('param', detailPocketParamSchema), async (c) => {
  const param = c.req.valid('param');
  const detailPocket = await DetailPocketCase.execute(param);
  return c.json(detailPocket);
});

controller.post('/', zValidator('json', createPocketSchema), async (c) => {
  const user = c.get('user');
  const payload = c.req.valid('json');
  const pocket = await CreatePocketCase.execute(user, payload);
  return c.json(pocket);
});

controller.post(
  '/spendings',
  zValidator('json', createSpendingPocketSchema),
  async (c) => {
    const user = c.get('user');
    const payload = c.req.valid('json');
    const spendingPocket = await CreateSpendingPocketCase.execute(
      user,
      payload
    );
    return c.json(spendingPocket);
  }
);

controller.post(
  '/recurrings',
  zValidator('json', createRecurringPocketSchema),
  async (c) => {
    const user = c.get('user');
    const payload = c.req.valid('json');
    const recurringPocket = await CreateRecurringPocketCase.execute(
      user,
      payload
    );
    return c.json(recurringPocket);
  }
);

controller.post(
  '/savings',
  zValidator('json', createSavingPocketSchema),
  async (c) => {
    const user = c.get('user');
    const payload = c.req.valid('json');
    const savingPocket = await CreateSavingPocketCase.execute(user, payload);
    return c.json(savingPocket);
  }
);

export const pocketController = controller;
