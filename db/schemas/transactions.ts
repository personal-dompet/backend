import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';
import { accounts } from './accounts';
import { TRANSACTION_TYPE } from '@/core/constants/transaction-type';
import { TRANSACTION_CATEGORY } from '@/core/constants/transaction-category';
import { financialActivities } from './financial-activities';

export const transactions = pgTable('transactions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  accountId: integer('account_id').references(() => accounts.id).notNull(),
  pocketId: integer('pocket_id').references(() => pockets.id).notNull(),
  financialActivityId: integer('financial_activity_id').references(() => financialActivities.id).notNull(),
  date: integer('date').notNull(),
  type: varchar('type', { length: 10 }).notNull().default(TRANSACTION_TYPE.EXPENSE),
  category: varchar('category', { length: 50 }).notNull().default(TRANSACTION_CATEGORY.OTHERS),
}, (table) => [
  index('transaction_user_id_index').on(table.userId),
  index('transaction_pocket_id_index').on(table.pocketId),
  index('transaction_account_id_index').on(table.accountId),
  index('transaction_financial_activity_id_index').on(table.financialActivityId),
  index('transaction_type_index').on(table.type),
  index('transaction_category_index').on(table.category),

  index('transaction_user_date_index').on(table.userId, table.date),
  index('transaction_user_type_index').on(table.userId, table.type),
  index('transaction_user_category_index').on(table.userId, table.category),
  index('transaction_user_account_date_index').on(table.userId, table.accountId, table.date),
  index('transaction_user_pocket_date_index').on(table.userId, table.pocketId, table.date),
  index('transaction_user_type_category_index').on(table.userId, table.type, table.category),
]);
