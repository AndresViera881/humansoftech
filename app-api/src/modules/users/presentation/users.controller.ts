import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { FindUsersUseCase } from '../application/use-cases/find-users.use-case';
import { FindUserUseCase } from '../application/use-cases/find-user.use-case';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { CreateUserDto } from '../application/dtos/create-user.dto';
import { UpdateUserDto } from '../application/dtos/update-user.dto';
import { Permissions } from '../../../shared/auth/decorators/permissions.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly findUsers: FindUsersUseCase,
    private readonly findUser: FindUserUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Permissions('users:read')
  @Get()
  findAll() {
    return this.findUsers.execute();
  }

  @Permissions('users:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findUser.execute(id);
  }

  @Permissions('users:write')
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Permissions('users:write')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.updateUser.execute(id, dto);
  }

  @Permissions('users:delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.deleteUser.execute(id);
  }
}
