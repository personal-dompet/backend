export const POCKET_TYPE = {
  WALLET: 'WALLET',
  SPENDING: 'SPENDING',
  SAVING: 'SAVING',
  RECURRING: 'RECURRING',
} as const

export type PocketType = (typeof POCKET_TYPE)[keyof typeof POCKET_TYPE]
