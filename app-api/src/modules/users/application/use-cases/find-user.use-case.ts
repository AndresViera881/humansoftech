import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string): Promise<any> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
}
