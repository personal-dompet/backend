import { User } from '@/core/entities/user-entity';
import { SimpleAccount } from './account.dto';
import { AccountService } from './account.service';
import { CreateAccountRequest, AccountFilter } from './account.schema';
import { Drizzle } from 'db';

export abstract class ListAccountCase {
  static async execute(user: User, query?: AccountFilter): Promise<SimpleAccount[]> {
    const accountService = new AccountService(Drizzle.getInstance());
    const accounts = await accountService.list(user, query);
    return accounts.map((account) => new SimpleAccount(account));
  };
}

export abstract class CreateAccountCase {
  static async execute(user: User, data: CreateAccountRequest): Promise<SimpleAccount> {
    const accountService = new AccountService(Drizzle.getInstance());
    const account = await accountService.create(user, data);
    return new SimpleAccount(account);
  }
}
