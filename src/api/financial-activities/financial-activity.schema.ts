import { financialActivities } from 'db/schemas/financial-activities';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { accountTransferInsertSchema, accountTransferSelectSchema } from './account-transfer/account-transfer.schema';
import { pocketTransferInsertSchema, pocketTransferSelectSchema } from './pocket-transfer/pocket-transfer.schema';
import { transactionInserSchema, transactionSelectSchema } from './transaction/transaction.schema';
import { FINANCIAL_ACTIVITY_TYPE } from '@/core/constants/financial-activity-type';
import { pocketSelectSchema } from '../pockets/pocket.schema';
import { accountSelectSchema } from '../accounts/account.schema';

const _financialActivitySelectSchema = createSelectSchema(financialActivities);
const _financialActivityInserSchema = createInsertSchema(financialActivities).omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  userId: true,
})

const financialActivitySelectSchema = _financialActivitySelectSchema.extend({
  accountTransfer: accountTransferSelectSchema.optional().nullable(),
  pocketTransfer: pocketTransferSelectSchema.optional().nullable(),
  transaction: transactionSelectSchema.optional().nullable(),
  pocket: pocketSelectSchema.optional().nullable(),
  account: accountSelectSchema.optional().nullable(),
  sourcePocket: pocketSelectSchema.optional().nullable(),
  sourceAccount: accountSelectSchema.optional().nullable(),
  destinationPocket: pocketSelectSchema.optional().nullable(),
  destinationAccount: accountSelectSchema.optional().nullable(),
});
export const financialActivityInsertSchema = _financialActivityInserSchema
  .extend({
    transaction: transactionInserSchema.optional().nullable(),
    accountTransfer: accountTransferInsertSchema.optional().nullable(),
    pocketTransfer: pocketTransferInsertSchema.optional().nullable(),
  })
  .refine((data) => data.type === FINANCIAL_ACTIVITY_TYPE.TRANSACTION && !data.transaction, {
    error: 'transaction must be provided when the activity type is "TRANSACTION"',
    path: ['transaction']
  })
  .refine((data) => data.type === FINANCIAL_ACTIVITY_TYPE.ACCOUNT_TRANSFER && !data.accountTransfer, {
    error: 'accontTransfer must be provided when the activity type is "ACCOUNT_TRANSFER"',
    path: ['accontTransfer']
  })
  .refine((data) => data.type === FINANCIAL_ACTIVITY_TYPE.POCKET_TRANSFER && !data.pocketTransfer, {
    error: 'pocketTransfer must be provided when the activity type is "POCKET_TRANSFER"',
    path: ['pocketTransfer']
  })


export type FinancialActivitySelect = z.infer<typeof financialActivitySelectSchema>;
export type FinancialActivityInsert = z.infer<typeof financialActivityInsertSchema>;