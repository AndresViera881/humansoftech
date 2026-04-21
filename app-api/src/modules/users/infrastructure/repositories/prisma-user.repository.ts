import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { hashPassword } from '../../../../shared/utils/hash-password';

const SELECT = {
  id: true,
  name: true,
  email: true,
  photo: true,
  cedula: true,
  active: true,
  createdAt: true,
  role: { select: { id: true, name: true } },
};

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<any[]> {
    return this.prisma.user.findMany({ select: SELECT, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.user.findUnique({ where: { id }, select: SELECT });
  }

  async create(dto: CreateUserDto): Promise<any> {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashPassword(dto.password),
        roleId: dto.roleId,
        active: dto.active ?? true,
        photo: dto.photo,
        cedula: dto.cedula,
      },
      select: SELECT,
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<any> {
    const { password, ...rest } = dto;
    const data: Record<string, unknown> = { ...rest };
    if (password) data.password = hashPassword(password);
    return this.prisma.user.update({ where: { id }, data, select: SELECT });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
