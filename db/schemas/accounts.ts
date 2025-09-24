import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';
import { ACCOUNT_TYPE } from '@/utils/constants/account-type';

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  name: varchar('name').notNull(),
  balance: integer('balance').notNull(),
  color: varchar('color', { length: 7 }),
  type: varchar('type', { length: 16 }).notNull().default(ACCOUNT_TYPE.CASH),
  ...timestamps,
})