import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly repo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateUserDto): Promise<any> {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El email ya está registrado');
    return this.repo.create(dto);
  }
}
