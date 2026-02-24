import { pgTable, varchar, integer, index } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';
import { POCKET_TYPE } from '@/core/constants/pocket-type';
import { sql } from 'drizzle-orm';

export const pockets = pgTable('pockets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  name: varchar('name').notNull(),
  color: varchar('color', { length: 7 }),
  balance: integer('balance').notNull().default(0),
  icon: varchar('icon'),
  priority: integer('priority').notNull().default(0),
  type: varchar('type', { length: 16 }).notNull().default(POCKET_TYPE.WALLET),
  ...timestamps,
}, (table) => [
  index('pocket_user_id_index').on(table.userId).where(sql`deleted_at IS NULL`),
  index('pocket_user_id_type_index').on(table.userId, table.type).where(sql`deleted_at IS NULL`),
]);

