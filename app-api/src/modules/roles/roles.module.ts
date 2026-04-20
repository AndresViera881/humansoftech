import { Module } from '@nestjs/common';
import { RoleRepository } from './domain/repositories/role.repository';
import { PrismaRoleRepository } from './infrastructure/repositories/prisma-role.repository';
import { FindRolesUseCase } from './application/use-cases/find-roles.use-case';
import { RolesController } from './presentation/roles.controller';

@Module({
  providers: [
    { provide: RoleRepository, useClass: PrismaRoleRepository },
    FindRolesUseCase,
  ],
  controllers: [RolesController],
})
export class RolesModule {}
