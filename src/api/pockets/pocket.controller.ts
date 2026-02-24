import { PocketRepository } from './pocket.repository';
import { Drizzle } from 'db';
import { App } from '@/core/lib/hono';
import { zValidator } from '@hono/zod-validator';
import { pocketInsertSchema } from './pocket.schema';

const controller = new App();

const drizzle = Drizzle.instance;
const repository = new PocketRepository(drizzle);

controller.get('/', async (context) => {
  const user = context.get('user');

  const pockets = await repository.list(user);

  return context.json(pockets);
})

controller.post('/', zValidator('json', pocketInsertSchema), async (context) => {
  const user = context.get('user');
  const payload = context.req.valid('json');

  const pocket = await repository.create(user, payload);
  return context.json(pocket);
})

export const pocketController = controller;
