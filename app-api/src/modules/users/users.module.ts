import { Module } from '@nestjs/common';
import { UserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { FindUsersUseCase } from './application/use-cases/find-users.use-case';
import { FindUserUseCase } from './application/use-cases/find-user.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UsersController } from './presentation/users.controller';

@Module({
  providers: [
    { provide: UserRepository, useClass: PrismaUserRepository },
    FindUsersUseCase,
    FindUserUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
