export const ACCOUNT_TYPE = {
  CASH: 'cash',
  BANK: 'bank',
  E_WALLET: 'e-wallet',
} as const

export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE]
