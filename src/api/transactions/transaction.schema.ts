import { TRANSACTION_CATEGORY } from "@/core/constants/transaction-category";
import { TRANSACTION_TYPE } from "@/core/constants/transaction-type";
import { transactions } from "db/schemas/transactions";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { PocketSelect } from "../pockets/pocket.schema";
import { AccountSelect } from "../accounts/account.schema";
import { WalletSelect } from "../wallets/wallet.schema";

export const transactionInsertSchema = createInsertSchema(transactions).pick({
  accountId: true,
  amount: true,
  category: true,
  date: true,
  description: true,
  pocketId: true,
  type: true,
});

const transactionSelectSchema = createSelectSchema(transactions);

export const transactionFilterSchema = z.object({
  // Pagination - page is mandatory as requested
  page: z.string().transform((value) => parseInt(value)),
  limit: z.string().transform((value) => parseInt(value)),

  // Pocket filter
  pocketId: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),

  // Amount range filter
  minAmount: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  maxAmount: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),

  // Date range filter (Unix timestamps)
  startDate: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  endDate: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),

  startCreatedAt: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  endCreatedAt: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),

  // Type and category filters
  type: z.enum(TRANSACTION_TYPE).optional(),
  category: z.enum(TRANSACTION_CATEGORY).optional(),

  // Search in description
  search: z.string().optional(),

  // Sorting options
  sortBy: z.enum(["date", "amount", "createdAt"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TransactionInsert = z.infer<typeof transactionInsertSchema>;
export type TransactionSelect = z.infer<typeof transactionSelectSchema>;
export type TransactionFilter = z.infer<typeof transactionFilterSchema>;

export type TransactionDetailSelect = TransactionSelect & {
  pocket: PocketSelect;
  account: AccountSelect;
  wallet: WalletSelect;
};
