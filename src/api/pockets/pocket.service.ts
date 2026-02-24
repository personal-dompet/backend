import { PocketRepository } from './pocket.repository';

export class PocketService {
  repository: PocketRepository;

  constructor(repository: PocketRepository) {
    this.repository = repository;
  }
}
