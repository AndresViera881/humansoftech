import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { RoleRepository } from '../../domain/repositories/role.repository';

@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<any[]> {
    return this.prisma.role.findMany({ orderBy: { name: 'asc' } });
  }
}
