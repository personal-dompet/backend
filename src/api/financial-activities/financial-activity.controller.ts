import { App } from '@/core/lib/hono';
import { Drizzle } from 'db';
import { FinancialActivityReposiory } from './financial-activity.repository';

const controller = new App();

const drizzle = Drizzle.instance;
const repository = new FinancialActivityReposiory(drizzle);

controller.get('/recent-transactions', async (context) => {
  const user = context.get('user');

  const recentTransactions = await repository.recentTransactions(user);

  return context.json(recentTransactions);
})

export const financialActivityController = controller;