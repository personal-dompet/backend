import { honoApp } from '@/core/lib/hono';
import { RecentTransactionCase } from './transaction.case';
import { RecentTransaction } from './transaction.dto';

const controller = honoApp();

controller.get('/recents', async (c) => {
  const user = c.get('user');
  const transactions = await RecentTransactionCase.execute(user);
  return c.json(transactions.map((transaction) => new RecentTransaction(transaction)));
});

export const transactionController = controller;
