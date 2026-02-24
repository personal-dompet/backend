export class Timestamp {
  createdAt: number;
  updatedAt?: number | null;

  constructor(data: { createdAt: number; updatedAt?: number | null }) {
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}