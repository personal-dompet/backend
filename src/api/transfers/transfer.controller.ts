import { honoApp } from '@/core/lib/hono';
import { zValidator } from '@hono/zod-validator';
import { pocketTransferFilterSchema, pocketTransferRequestSchema } from './transfer.schema';
import { ListPocketTransferCase, PocketTransferCase } from './transfer.case';

const controller = honoApp();

controller.post('/pockets', zValidator('json', pocketTransferRequestSchema), async (c) => {
  const request = c.req.valid('json');
  const user = c.get('user');
  const transfer = await PocketTransferCase.execute(request, user);
  return c.json(transfer);
});

controller.get('/pockets', zValidator('query', pocketTransferFilterSchema), async (c) => {
  const request = c.req.valid('query');
  const user = c.get('user');
  const transfers = await ListPocketTransferCase.execute(request, user);
  return c.json(transfers);
});

export const transferController = controller;
