import { honoApp } from '@/core/lib/hono';
import { zValidator } from '@hono/zod-validator';
import {
  transferFilterSchema,
  pocketTransferRequestSchema,
  accountTransferRequestSchema,
} from './transfer.schema';
import {
  AccountTransferCase,
  ListAccountTransferCase,
  ListPocketTransferCase,
  PocketTransferCase,
} from './transfer.case';

const controller = honoApp();

controller.post(
  '/pockets',
  zValidator('json', pocketTransferRequestSchema),
  async (c) => {
    const request = c.req.valid('json');
    const user = c.get('user');
    const transfer = await PocketTransferCase.execute(request, user);
    return c.json(transfer);
  }
);

controller.get(
  '/pockets',
  zValidator('query', transferFilterSchema),
  async (c) => {
    const request = c.req.valid('query');
    const user = c.get('user');
    const transfers = await ListPocketTransferCase.execute(request, user);
    return c.json(transfers);
  }
);

controller.post(
  '/accounts',
  zValidator('json', accountTransferRequestSchema),
  async (c) => {
    const request = c.req.valid('json');
    const user = c.get('user');
    const transfer = await AccountTransferCase.execute(request, user);
    return c.json(transfer);
  }
);

controller.get(
  '/accounts',
  zValidator('query', transferFilterSchema),
  async (c) => {
    const request = c.req.valid('query');
    const user = c.get('user');
    const transfers = await ListAccountTransferCase.execute(request, user);
    return c.json(transfers);
  }
);

export const transferController = controller;
