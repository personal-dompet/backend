import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';
import { FINANCIAL_ACTIVITY_TYPE } from '@/core/constants/financial-activity-type';
import { sql } from 'drizzle-orm';

export const financialActivities = pgTable('financial_activities', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  amount: integer('amount').notNull(),
  description: varchar('description'),
  type: varchar('type', { length: 16 }).notNull().default(FINANCIAL_ACTIVITY_TYPE.TRANSACTION),
  ...timestamps,
}, (table) => [
  index('financial_activity_user_id_index').on(table.userId).where(sql`deleted_at IS NULL`),
  index('financial_activity_user_id_type_index').on(table.userId, table.type).where(sql`deleted_at IS NULL`),
]);
