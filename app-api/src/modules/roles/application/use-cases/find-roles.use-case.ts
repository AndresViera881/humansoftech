import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../domain/repositories/role.repository';

@Injectable()
export class FindRolesUseCase {
  constructor(private readonly repo: RoleRepository) {}

  async execute(): Promise<any[]> {
    return this.repo.findAll();
  }
}
