import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { MeUseCase } from './application/use-cases/me.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from '../../shared/auth/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'default_secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [LoginUseCase, MeUseCase, RegisterUseCase, ChangePasswordUseCase, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
