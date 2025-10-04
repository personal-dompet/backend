import { honoApp } from '@/core/lib/hono';
import { RecentTransactionCase, TransactionListCase } from './transaction.case';
import { TransactionDetail } from './transaction.dto';
import { zValidator } from '@hono/zod-validator';
import { transactionFilterSchema } from './transaction.schema';

const controller = honoApp();

controller.get('/', zValidator('query', transactionFilterSchema), async (c) => {
  const user = c.get('user');
  const filter = c.req.valid('query');
  const transactions = await TransactionListCase.execute(user, filter);
  return c.json(transactions.map((transaction) => new TransactionDetail(transaction)));
});

controller.get('/recents', async (c) => {
  const user = c.get('user');
  const transactions = await RecentTransactionCase.execute(user);
  return c.json(transactions.map((transaction) => new TransactionDetail(transaction)));
});

export const transactionController = controller;
