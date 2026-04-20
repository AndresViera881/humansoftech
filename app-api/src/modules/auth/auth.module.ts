import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { MeUseCase } from './application/use-cases/me.use-case';
import { AuthController } from './presentation/auth.controller';

@Module({
  providers: [LoginUseCase, MeUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
