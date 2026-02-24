import { Pocket } from '../pockets/pocket.dto';
import { WalletPocket } from './wallet.schema';

export class Wallet extends Pocket {
  totalBalance: number;

  constructor(data: WalletPocket) {
    super(data);
    this.totalBalance = data.totalBalance;
  }
}
