import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Usuario no encontrado');
    await this.repo.delete(id);
  }
}
