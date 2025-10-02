import { PocketType } from '@/core/constants/pocket-type';
import { PocketSelect } from './pocket.schema';

export class Pocket {
  id: number;
  name: string;
  color?: string | null;
  balance: number;
  icon?: string | null;
  priority: number;
  type: PocketType;
  createdAt: number;
  updatedAt: number | null;

  constructor(data: PocketSelect) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.icon = data.icon;
    this.priority = data.priority;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.type = data.type as PocketType;
    this.balance = data.balance;
  }
}
