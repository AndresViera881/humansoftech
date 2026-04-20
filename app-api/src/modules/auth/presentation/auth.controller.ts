import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { MeUseCase } from '../application/use-cases/me.use-case';
import { LoginDto } from '../application/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly login: LoginUseCase,
    private readonly me: MeUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  doLogin(@Body() dto: LoginDto) {
    return this.login.execute(dto);
  }

  @Get('me')
  getMe(@Query('userId') userId: string) {
    return this.me.execute(userId);
  }
}
