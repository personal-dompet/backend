import { integer } from "drizzle-orm/pg-core";
import { AppDate } from '@/utils/lib/app-date';

export const timestamps = {
  createdAt: integer('created_at').notNull().$defaultFn(() => new AppDate().unix()),
  updatedAt: integer('updated_at').$onUpdateFn(() => new AppDate().unix()),
  deletedAt: integer('deleted_at'),
}