import { defineRelations } from 'drizzle-orm';
import { accountDetails } from './account-details';
import { accountTransfers } from './account-transfers';
import { accounts } from './accounts';
import { financialActivities } from './financial-activities';
import { pocketTransfers } from './pocket-transfers';
import { pockets } from './pockets';
import { recurringPockets } from './recurring-pockets';
import { savingPockets } from './saving-pockets';
import { spendingPockets } from './spending-pockets';
import { transactions } from './transactions';
import { walletPockets } from './wallet-pockets';
import { RELATIONSHIP_ALIASES } from '@/core/constants/relationship-aliases';

export const dompetRelations = defineRelations({
  accountDetails,
  accountTransfers,
  accounts,
  financialActivities,
  pocketTransfers,
  pockets,
  recurringPockets,
  savingPockets,
  spendingPockets,
  transactions,
  walletPockets,
}, (relation) => ({
  accountDetails: {
    account: relation.one.accounts({
      from: relation.accountDetails.accountId,
      to: relation.accounts.id,
    })
  },
  accountTransfers: {
    financialActivity: relation.one.financialActivities({
      from: relation.accountTransfers.financialActivityId,
      to: relation.financialActivities.id,
    }),
    source: relation.one.accounts({
      from: relation.accountTransfers.sourceId,
      to: relation.accounts.id,
      alias: RELATIONSHIP_ALIASES.SOURCE_ACCOUNT,
    }),
    destination: relation.one.accounts({
      from: relation.accountTransfers.destinationId,
      to: relation.accounts.id,
      alias: RELATIONSHIP_ALIASES.DESTINATION_ACCOUNT
    }),
  },
  accounts: {
    detail: relation.one.accountDetails({
      from: relation.accounts.id,
      to: relation.accountDetails.accountId,
    }),
    transfersAsSource: relation.many.accountTransfers({
      from: relation.accounts.id,
      to: relation.accountTransfers.sourceId,
      alias: RELATIONSHIP_ALIASES.SOURCE_ACCOUNT
    }),
    transfersAsDestination: relation.many.accountTransfers({
      from: relation.accounts.id,
      to: relation.accountTransfers.sourceId,
      alias: RELATIONSHIP_ALIASES.DESTINATION_ACCOUNT
    }),
    transactions: relation.many.transactions({
      from: relation.accounts.id,
      to: relation.transactions.accountId,
    }),
  },
  financialActivities: {
    accountTransfer: relation.one.accountTransfers({
      from: relation.financialActivities.id,
      to: relation.accountTransfers.financialActivityId,
    }),
    pocketTransfer: relation.one.pocketTransfers({
      from: relation.financialActivities.id,
      to: relation.pocketTransfers.financialActivityId,
    }),
    transaction: relation.one.transactions({
      from: relation.financialActivities.id,
      to: relation.transactions.financialActivityId,
    }),
  },
  pocketTransfers: {
    financialActivities: relation.one.financialActivities({
      from: relation.pocketTransfers.financialActivityId,
      to: relation.financialActivities.id,
    }),
    source: relation.one.pockets({
      from: relation.pocketTransfers.sourceId,
      to: relation.pockets.id,
      alias: RELATIONSHIP_ALIASES.SOURCE_POCKET,
    }),
    destination: relation.one.pockets({
      from: relation.pocketTransfers.destinationId,
      to: relation.pockets.id,
      alias: RELATIONSHIP_ALIASES.DESTINATION_POCKET
    }),
  },
  pockets: {
    saving: relation.one.savingPockets({
      from: relation.pockets.id,
      to: relation.savingPockets.pocketId,
    }),
    spending: relation.one.spendingPockets({
      from: relation.pockets.id,
      to: relation.spendingPockets.pocketId,
    }),
    recurring: relation.one.recurringPockets({
      from: relation.pockets.id,
      to: relation.recurringPockets.pocketId,
    }),
    wallet: relation.one.walletPockets({
      from: relation.pockets.id,
      to: relation.walletPockets.pocketId,
    }),
    transfersAsSource: relation.many.pocketTransfers({
      from: relation.pockets.id,
      to: relation.pocketTransfers.sourceId,
      alias: RELATIONSHIP_ALIASES.SOURCE_POCKET
    }),
    transfersAsDestination: relation.many.pocketTransfers({
      from: relation.pockets.id,
      to: relation.pocketTransfers.sourceId,
      alias: RELATIONSHIP_ALIASES.DESTINATION_POCKET
    }),
    transactions: relation.many.transactions({
      from: relation.pockets.id,
      to: relation.transactions.pocketId,
    }),
  },
  recurringPockets: {
    pocket: relation.one.pockets({
      from: relation.recurringPockets.pocketId,
      to: relation.pockets.id,
    }),
  },
  savingPockets: {
    pocket: relation.one.pockets({
      from: relation.savingPockets.pocketId,
      to: relation.pockets.id,
    }),
  },
  spendingPockets: {
    pocket: relation.one.pockets({
      from: relation.spendingPockets.pocketId,
      to: relation.pockets.id,
    }),
  },
  transactions: {
    financialActivity: relation.one.financialActivities({
      from: relation.transactions.financialActivityId,
      to: relation.financialActivities.id,
    }),
    account: relation.one.accounts({
      from: relation.transactions.accountId,
      to: relation.accounts.id,
    }),
    pocket: relation.one.pockets({
      from: relation.transactions.pocketId,
      to: relation.pockets.id,
    }),
  },
  walletPockets: {
    pocket: relation.one.pockets({
      from: relation.walletPockets.pocketId,
      to: relation.pockets.id,
    }),
  },
}))