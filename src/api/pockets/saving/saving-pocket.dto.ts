import { Pocket } from "../pocket.dto";
import { PocketSelect } from "../pocket.schema";
import { SavingPocketSelect } from "./saving-pocket.schema";

export class SavingPocket extends Pocket {
  targetAmount?: number | null;
  targetDescription?: string | null;
  targetDate?: number | null;

  constructor(savingPocket: PocketSelect & SavingPocketSelect) {
    super(savingPocket);
    this.targetAmount = savingPocket.targetAmount;
    this.targetDescription = savingPocket.targetDescription;
    this.targetDate = savingPocket.targetDate;
  }
}