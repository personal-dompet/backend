import { User } from '@/utils/entities/user-entity';
import { Wallet } from './wallet.dto';
import { WalletService } from './wallet.service';
import { PocketService } from '../pockets/pocket.service';
import { TopUpWallet } from './wallet.schema';
import { TransactionService } from '../transactions/transaction.service';
import dayjs from 'dayjs';
import { TRANSACTION_TYPE } from '@/utils/constants/transaction-type';
import { TRANSACTION_CATEGORY } from '@/utils/constants/transaction-category';

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
    const pocket = await PocketService.get(user);
    const currentWallet = await WalletService.get(user);

    const { amount, description } = request;
    await TransactionService.create({
      amount,
      date: dayjs().unix(),
      description,
      userId: user.uid,
      pocketId: pocket.id,
      type: TRANSACTION_TYPE.INCOME,
      category: TRANSACTION_CATEGORY.TOP_UP,
      accountId: request.accountId,
    })
    const wallet = await WalletService.update(pocket, { balance: currentWallet.balance + amount, availableBalance: currentWallet.availableBalance + amount });
    return new Wallet({
      ...wallet,
      ...pocket,
    })
  }
}