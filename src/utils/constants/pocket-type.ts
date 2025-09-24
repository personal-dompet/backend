export const POCKET_TYPE = {
  WALLET: 'wallet',
  SPENDING: 'spending',
  SAVING: 'saving',
  RECURRING: 'recurring',
} as const

export type PocketType = (typeof POCKET_TYPE)[keyof typeof POCKET_TYPE]
