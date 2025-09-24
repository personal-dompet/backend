import { User } from '@/utils/entities/user-entity';
import { SimpleAccount } from './account.dto';
import { AccountService } from './account.service';
import { CreateAccountRequest, AccountFilter } from './account.schema';

export abstract class ListAccountCase {
  static async execute(user: User, query?: AccountFilter): Promise<SimpleAccount[]> {
    const accounts = await AccountService.list(user, query);
    return accounts.map((account) => new SimpleAccount(account));
  };
}

export abstract class CreateAccountCase {
  static async execute(user: User, data: CreateAccountRequest): Promise<SimpleAccount> {
    const account = await AccountService.create(user, data);
    return new SimpleAccount(account);
  }
}