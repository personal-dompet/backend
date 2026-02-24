export const ACCOUNT_TYPE = {
  CASH: 'CASH',
  BANK: 'BANK',
  E_WALLET: 'E_WALLET',
} as const

export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE]
