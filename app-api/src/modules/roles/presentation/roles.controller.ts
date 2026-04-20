import { Controller, Get } from '@nestjs/common';
import { FindRolesUseCase } from '../application/use-cases/find-roles.use-case';

@Controller('roles')
export class RolesController {
  constructor(private readonly findRoles: FindRolesUseCase) {}

  @Get()
  findAll() {
    return this.findRoles.execute();
  }
}
