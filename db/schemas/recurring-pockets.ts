import { pgTable, integer, varchar, index } from "drizzle-orm/pg-core";
import { pockets } from "./pockets";

export const recurringPockets = pgTable("recurring_pockets", {
  pocketId: integer("pocket_id")
    .references(() => pockets.id)
    .primaryKey(),
  userId: varchar("user_id").notNull(),
  productName: varchar("product_name"),
  productDescription: varchar("product_description"),
  billingDate: integer("billing_date"),
  amount: integer("amount"),
}, (table) => [
  index('recurring_pocket_id_index').on(table.pocketId),
  index('recurring_user_id_index').on(table.userId),
  index('recurring_compose_index').on(table.pocketId, table.userId),
]);

