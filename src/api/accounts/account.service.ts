import { User } from '@/utils/entities/user-entity';
import { AccountFilter, AccountSelect, CreateAccountRequest } from './account.schema';
import { db } from 'db';
import { accounts } from 'db/schemas/accounts';
import { and, desc, eq, ilike } from 'drizzle-orm';

export abstract class AccountService {
  static async create(user: User, payload: CreateAccountRequest): Promise<AccountSelect> {
    const [account] = await db
      .insert(accounts)
      .values({ ...payload, userId: user.uid })
      .returning();

    return account;
  }

  static async get(user: User): Promise<AccountSelect> {
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.uid))
      .limit(1);

    return account;
  }

  static async list(user: User, query?: AccountFilter): Promise<AccountSelect[]> {
    const queries = [
      eq(accounts.userId, user.uid),
    ];

    if (query?.type) {
      queries.push(eq(accounts.type, query.type));
    }

    if (query?.keyword) {
      queries.push(ilike(accounts.name, `%${query.keyword}%`));
    }

    const allAccounts = await db
      .select()
      .from(accounts)
      .where(and(...queries))
      .orderBy(desc(accounts.createdAt));

    return allAccounts;
  }
}