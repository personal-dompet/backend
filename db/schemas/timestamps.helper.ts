import { integer } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: integer('created_at').notNull().$defaultFn(() => Math.floor(new Date().getTime() / 1000)),
  updatedAt: integer('updated_at').$onUpdateFn(() => Math.floor(new Date().getTime() / 1000)),
  deletedAt: integer('deleted_at'),
}
