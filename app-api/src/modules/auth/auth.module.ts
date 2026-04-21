import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { MeUseCase } from './application/use-cases/me.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { AuthController } from './presentation/auth.controller';

@Module({
  providers: [LoginUseCase, MeUseCase, RegisterUseCase, ChangePasswordUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
