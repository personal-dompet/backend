import { User } from "@/core/dto/user";
import { Wallet } from "./wallet.dto";
import { WalletService } from "./wallet.service";
import { TopUpWallet, WalletColor } from "./wallet.schema";
import { TransactionService } from "../transactions/transaction.service";
import { TRANSACTION_TYPE } from "@/core/constants/transaction-type";
import { TRANSACTION_CATEGORY } from "@/core/constants/transaction-category";
import { Drizzle } from "db";

export abstract class GetDetailWalletCase {
  static async execute(user: User, query: WalletColor): Promise<Wallet> {
    const walletService = new WalletService(Drizzle.getInstance());
    const wallet = await walletService.get(user);

    if (wallet) return new Wallet(wallet);

    const newWallet = await InitWalletCase.execute(user, query);

    return newWallet;
  }
}

export abstract class InitWalletCase {
  static async execute(user: User, query: WalletColor): Promise<Wallet> {
    const walletService = new WalletService(Drizzle.getInstance());
    const [wallet, pocket] = await walletService.create(user, query.color);
    return new Wallet({
      ...pocket,
      ...wallet,
    });
  }
}

export abstract class TopUpWalletCase {
  static async execute(user: User, request: TopUpWallet): Promise<Wallet> {
    const drizzle = Drizzle.getInstance();
    const walletService = new WalletService(drizzle);
    const transactionService = new TransactionService(drizzle);
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
    });
    return new Wallet(wallet);
  }
}
