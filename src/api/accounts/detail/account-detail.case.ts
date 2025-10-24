import { User } from '@/core/dto/user';
import { CreateAccountDetail } from './account-detail.schema';
import { AccountDetail } from './account-detail.dto';
import { Drizzle } from 'db';
import { AccountDetailService } from './account-detail.service';

export abstract class CreateAccountDetailCase {
  static async execute(user: User, payload: CreateAccountDetail): Promise<AccountDetail> {
    const drizzle = Drizzle.getInstance();
    const accountDetailService = new AccountDetailService(drizzle);

    const accountDetail = await accountDetailService.create(user, payload);

    return new AccountDetail(accountDetail);
  }
}