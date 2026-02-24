import { User } from '@/core/schemas/user';
import { FinancialActivityReposiory } from './financial-activity.repository';
import { FinancialActivityInsert } from './financial-activity.schema';

export class FinancialActivityService {
  repository: FinancialActivityReposiory;

  constructor(repository: FinancialActivityReposiory) {
    this.repository = repository;
  }

  // async create(user: User, payload: FinancialActivityInsert): 
}