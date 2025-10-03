import { PocketType } from '@/core/constants/pocket-type';
import { PocketSelect } from './pocket.schema';
import { Timestamp } from '@/core/dto/timestamp';

export class Pocket extends Timestamp {
  id: number;
  name: string;
  color?: string | null;
  balance: number;
  icon?: string | null;
  priority: number;
  type: PocketType;

  constructor(data: PocketSelect) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.icon = data.icon;
    this.priority = data.priority;
    this.type = data.type as PocketType;
    this.balance = data.balance;
  }
}
