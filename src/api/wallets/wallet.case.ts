import { User } from '@/core/entities/user-entity';
import { Wallet } from './wallet.dto';
import { WalletService } from './wallet.service';
import { PocketService } from '../pockets/pocket.service';
import { TopUpWallet } from './wallet.schema';
import { TransactionService } from '../transactions/transaction.service';
import dayjs from 'dayjs';
import { TRANSACTION_TYPE } from '@/core/constants/transaction-type';
import { TRANSACTION_CATEGORY } from '@/core/constants/transaction-category';

export abstract class GetDetailWalletCase {
  static async execute(user: User): Promise<Wallet> {
    const wallet = await WalletService.get(user);

    if (wallet) return new Wallet(wallet);

    const newWallet = await InitWalletCase.execute(user);

    return newWallet;
  }
}

export abstract class InitWalletCase {
  static async execute(user: User): Promise<Wallet> {
    const [wallet, pocket] = await WalletService.create(user);
    return new Wallet({
      ...pocket,
      ...wallet,
    });
  }
}

export abstract class TopUpWalletCase {
  static async execute(user: User, request: TopUpWallet): Promise<Wallet> {
    const currentWallet = await WalletService.get(user);
    const { amount, description, accountId } = request;
    const wallet = await TransactionService.topUp({
      amount,
      date: dayjs().unix(),
      description,
      userId: user.uid,
      pocketId: currentWallet.pocketId,
      type: TRANSACTION_TYPE.INCOME,
      category: TRANSACTION_CATEGORY.TOP_UP,
      accountId: accountId,
    })
    return new Wallet(wallet)
  }
}
