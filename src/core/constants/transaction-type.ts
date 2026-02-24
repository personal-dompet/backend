export const TRANSACTION_TYPE = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]
