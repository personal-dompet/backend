import { User } from '@/core/entities/user-entity';
import { AccountService } from './account.service';
import { CreateAccountRequest, AccountFilter } from './account.schema';
import { Drizzle } from 'db';
import { Account } from './account.dto';

export abstract class ListAccountCase {
  static async execute(user: User, query?: AccountFilter): Promise<Account[]> {
    const accountService = new AccountService(Drizzle.getInstance());
    const accounts = await accountService.list(user, query);
    return accounts.map((account) => new Account(account));
  };
}

export abstract class CreateAccountCase {
  static async execute(user: User, data: CreateAccountRequest): Promise<Account> {
    const accountService = new AccountService(Drizzle.getInstance());
    const account = await accountService.create(user, data);
    return new Account(account);
  }
}
