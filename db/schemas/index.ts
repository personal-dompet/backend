import * as pocketSchema from './pockets'
import * as accountSchema from './accounts'
import * as accountDetailSchema from './account-details'
import * as accountTransferSchema from './account-transfers'
import * as financialActivitySchema from './financial-activities'
import * as pocketTransferSchema from './pocket-transfers'
import * as recurringPocketSchema from './recurring-pockets'
import * as savingPocketSchema from './saving-pockets'
import * as spendingPocketSchema from './spending-pockets'
import * as transactionSchema from './transactions'
import * as walletPocketSchema from './wallet-pockets'

export const schema = {
  ...pocketSchema,
  ...accountSchema,
  ...accountDetailSchema,
  ...accountTransferSchema,
  ...financialActivitySchema,
  ...pocketTransferSchema,
  ...recurringPocketSchema,
  ...savingPocketSchema,
  ...spendingPocketSchema,
  ...transactionSchema,
  ...walletPocketSchema,
}