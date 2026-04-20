import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly repo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<any> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    if (dto.email) {
      const conflict = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (conflict && conflict.id !== id) throw new ConflictException('El email ya está registrado');
    }

    return this.repo.update(id, dto);
  }
}
