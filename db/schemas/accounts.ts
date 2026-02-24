import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';
import { ACCOUNT_TYPE } from '@/core/constants/account-type';
import { sql } from 'drizzle-orm';

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  name: varchar('name').notNull(),
  balance: integer('balance').notNull(),
  color: varchar('color', { length: 7 }),
  type: varchar('type', { length: 16 }).notNull().default(ACCOUNT_TYPE.CASH),
  ...timestamps,
}, (table) => [
  index('account_user_id_index').on(table.userId).where(sql`deleted_at IS NULL`),
  index('account_user_id_type_index').on(table.userId, table.type).where(sql`deleted_at IS NULL`),
])
