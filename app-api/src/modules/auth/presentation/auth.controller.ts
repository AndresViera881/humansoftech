import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { MeUseCase } from '../application/use-cases/me.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { ChangePasswordUseCase } from '../application/use-cases/change-password.use-case';
import { LoginDto } from '../application/dtos/login.dto';
import { RegisterDto } from '../application/dtos/register.dto';
import { ChangePasswordDto } from '../application/dtos/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly login: LoginUseCase,
    private readonly me: MeUseCase,
    private readonly register: RegisterUseCase,
    private readonly changePassword: ChangePasswordUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  doLogin(@Body() dto: LoginDto) {
    return this.login.execute(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  doRegister(@Body() dto: RegisterDto) {
    return this.register.execute(dto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  doChangePassword(@Body() dto: ChangePasswordDto) {
    return this.changePassword.execute(dto);
  }

  @Get('me')
  getMe(@Query('userId') userId: string) {
    return this.me.execute(userId);
  }
}
