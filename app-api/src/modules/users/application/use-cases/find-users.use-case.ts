import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class FindUsersUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(): Promise<any[]> {
    return this.repo.findAll();
  }
}
