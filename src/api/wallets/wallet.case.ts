import { User } from '@/core/entities/user-entity';
import { Wallet } from './wallet.dto';
import { WalletService } from './wallet.service';
import { TopUpWallet } from './wallet.schema';
import { TransactionService } from '../transactions/transaction.service';
import dayjs from 'dayjs';
import { TRANSACTION_TYPE } from '@/core/constants/transaction-type';
import { TRANSACTION_CATEGORY } from '@/core/constants/transaction-category';
import { Drizzle } from 'db';
import { POCKET_TYPE } from '@/core/constants/pocket-type';

export abstract class GetDetailWalletCase {
  static async execute(user: User): Promise<Wallet> {
    const walletService = new WalletService(Drizzle.getInstance());
    const wallet = await walletService.get(user);

    if (wallet) return new Wallet({
      ...wallet,
      type: POCKET_TYPE.WALLET,
    });

    const newWallet = await InitWalletCase.execute(user);

    return newWallet;
  }
}

export abstract class InitWalletCase {
  static async execute(user: User): Promise<Wallet> {
    const walletService = new WalletService(Drizzle.getInstance());
    const [wallet, pocket] = await walletService.create(user);
    return new Wallet({
      ...pocket,
      type: POCKET_TYPE.WALLET,
      ...wallet,
    });
  }
}

export abstract class TopUpWalletCase {
  static async execute(user: User, request: TopUpWallet): Promise<Wallet> {
    const walletService = new WalletService(Drizzle.getInstance());
    const transactionService = new TransactionService(Drizzle.getInstance());
    const currentWallet = await walletService.get(user);
    const { amount, description, accountId, date } = request;
    const wallet = await transactionService.topUp({
      amount,
      date,
      description,
      userId: user.uid,
      pocketId: currentWallet.pocketId,
      type: TRANSACTION_TYPE.INCOME,
      category: TRANSACTION_CATEGORY.TOP_UP,
      accountId: accountId,
    })
    return new Wallet({
      ...wallet,
      type: POCKET_TYPE.WALLET,
    })
  }
}
