import { POCKET_TYPE, PocketType } from '@/core/constants/pocket-type';
import { AllPocket } from './pocket.schema';

export class Pocket {
  id: number;
  userId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  priority: number;
  createdAt: number;
  updatedAt: number | null;

  constructor(data: Pocket) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.description = data.description;
    this.color = data.color;
    this.icon = data.icon;
    this.priority = data.priority;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class SimplePocket {
  id: number;
  name: string;
  color?: string | null;
  icon?: string | null;
  priority: number;
  balance: number;
  type: PocketType;

  constructor(data: AllPocket) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.icon = data.icon;
    this.priority = data.priority;
    this.type = data.type as PocketType;

    if (this.type === POCKET_TYPE.RECURRING) {
      this.balance = data.recurring?.balance || 0;
    } else if (this.type === POCKET_TYPE.SAVING) {
      this.balance = data.saving?.balance || 0;
    } else {
      this.balance = data.spending?.balance || 0;
    }
  }
}
