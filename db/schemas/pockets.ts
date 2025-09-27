// import { relations } from 'drizzle-orm';
import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';
import { POCKET_TYPE } from '@/core/constants/pocket-type';

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
});
