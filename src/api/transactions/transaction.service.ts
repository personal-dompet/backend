import { transactions } from "db/schemas/transactions";
import {
  TransactionInsert,
  TransactionFilter,
  TransactionDetailSelect,
} from "./transaction.schema";
import { and, asc, desc, ilike, gte, lte, eq, isNull } from "drizzle-orm";
import { User } from "@/core/dto/user";
import { WalletPocket } from "../wallets/wallet.schema";
import { walletPockets } from "db/schemas/wallet-pockets";
import { walletColumns } from "../wallets/wallet.column";
import { pockets } from "db/schemas/pockets";
import { pocketColumns } from "../pockets/pocket.column";
import { accountColumns } from "../accounts/account.column";
import { accounts } from "db/schemas/accounts";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Drizzle } from "db";
import { transactionColumns } from "./transaction.column";
import { TRANSACTION_TYPE } from "@/core/constants/transaction-type";
import { alias } from "drizzle-orm/pg-core";
import { WalletService } from "../wallets/wallet.service";

export class TransactionService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async create(
    user: User,
    payload: TransactionInsert
  ): Promise<TransactionDetailSelect> {
    const result = await this.db.transaction(
      async (tx): Promise<TransactionDetailSelect> => {
        const [transaction] = await tx
          .insert(transactions)
          .values({
            ...payload,
            userId: user.uid,
          })
          .returning();

        const accountQuery = and(
          isNull(accounts.deletedAt),
          eq(accounts.id, payload.accountId)
        );

        const pocketQuery = and(
          isNull(pockets.deletedAt),
          eq(pockets.id, payload.pocketId)
        );

        const walletQuery = eq(walletPockets.userId, user.uid);

        const [[pocket], [account], [wallet]] = await Promise.all([
          tx.select().from(pockets).where(pocketQuery).limit(1),
          tx.select().from(accounts).where(accountQuery).limit(1),
          tx
            .select({
              ...walletColumns,
              ...pocketColumns,
            })
            .from(walletPockets)
            .innerJoin(pockets, eq(walletPockets.pocketId, pockets.id))
            .where(walletQuery)
            .limit(1),
        ]);

        const relativeAmount =
          payload.amount * (payload.type === TRANSACTION_TYPE.INCOME ? 1 : -1);

        pocket.balance = pocket.balance + relativeAmount;
        account.balance = account.balance + relativeAmount;
        wallet.totalBalance = wallet.totalBalance + relativeAmount;

        await Promise.all([
          tx
            .update(pockets)
            .set({
              balance: pocket.balance,
            })
            .where(pocketQuery),
          tx
            .update(accounts)
            .set({
              balance: account.balance,
            })
            .where(accountQuery),
          tx
            .update(walletPockets)
            .set({
              totalBalance: wallet.totalBalance,
            })
            .where(walletQuery),
        ]);

        return {
          ...transaction,
          account,
          pocket,
          wallet,
        };
      }
    );

    return result;
  }

  async topUp(user: User, payload: TransactionInsert): Promise<WalletPocket> {
    const result = await this.db.transaction(async (tx) => {
      const [transaction] = await tx
        .insert(transactions)
        .values({ ...payload, userId: user.uid })
        .returning();

      const [wallet] = await tx
        .select({
          ...walletColumns,
          ...pocketColumns,
        })
        .from(walletPockets)
        .innerJoin(pockets, eq(walletPockets.pocketId, pockets.id))
        .where(and(eq(pockets.id, payload.pocketId), isNull(pockets.deletedAt)))
        .limit(1);

      if (!wallet) {
        tx.rollback();
        throw new Error("Pocket not found");
      }

      wallet.balance += transaction.amount;
      wallet.totalBalance += transaction.amount;

      await tx
        .update(pockets)
        .set({
          balance: wallet.balance,
        })
        .where(eq(pockets.id, payload.pocketId));

      await tx
        .update(walletPockets)
        .set({
          totalBalance: wallet.totalBalance,
        })
        .where(eq(walletPockets.pocketId, payload.pocketId));

      const [account] = await tx
        .select(accountColumns)
        .from(accounts)
        .where(eq(accounts.id, transaction.accountId))
        .limit(1);

      if (!account) {
        tx.rollback();
        throw new Error("Account not found");
      }

      account.balance += transaction.amount;

      await tx
        .update(accounts)
        .set({
          balance: account.balance,
        })
        .where(eq(accounts.id, transaction.accountId));

      return wallet;
    });

    return result;
  }

  async list(
    user: User,
    filter: TransactionFilter
  ): Promise<TransactionDetailSelect[]> {
    const {
      page,
      limit = 20,
      pocketId,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      type,
      category,
      search,
      endCreatedAt,
      startCreatedAt,
      sortBy = "date",
      sortOrder = "desc",
    } = filter;

    const offset = (page - 1) * limit;

    // Build conditions array for conditional filtering
    const conditions = [
      eq(transactions.userId, user.uid),
      pocketId !== undefined ? eq(transactions.pocketId, pocketId) : undefined,
      minAmount !== undefined ? gte(transactions.amount, minAmount) : undefined,
      maxAmount !== undefined ? lte(transactions.amount, maxAmount) : undefined,
      startDate !== undefined ? gte(transactions.date, startDate) : undefined,
      endDate !== undefined ? lte(transactions.date, endDate) : undefined,
      startCreatedAt !== undefined
        ? gte(transactions.createdAt, startCreatedAt)
        : undefined,
      endCreatedAt !== undefined
        ? lte(transactions.createdAt, endCreatedAt)
        : undefined,
      type !== undefined ? eq(transactions.type, type) : undefined,
      category !== undefined ? eq(transactions.category, category) : undefined,
      search !== undefined
        ? ilike(transactions.description, `%${search}%`)
        : undefined,
    ].filter((condition) => condition !== undefined);

    const sortColumn =
      sortBy === "date"
        ? transactions.date
        : sortBy === "amount"
        ? transactions.amount
        : transactions.createdAt;

    const walletService = new WalletService(this.drizzle);

    const [transactionList, wallet] = await Promise.all([
      this.db
        .select({
          ...transactionColumns,
          account: accounts,
          pocket: pockets,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .innerJoin(pockets, eq(transactions.pocketId, pockets.id))
        .where(and(...conditions))
        .orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn))
        .limit(limit)
        .offset(offset),
      walletService.get(user),
    ]);
    return transactionList.map((transaction) => {
      return {
        ...transaction,
        wallet,
      };
    });
  }
}
