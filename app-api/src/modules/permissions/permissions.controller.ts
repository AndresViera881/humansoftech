import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permissions } from '../../shared/auth/decorators/permissions.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissions: PermissionsService) {}

  @Get()
  findAll() {
    return this.permissions.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissions.findOne(id);
  }

  @Permissions('permissions:manage')
  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.permissions.create(dto);
  }

  @Permissions('permissions:manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissions.update(id, dto);
  }

  @Permissions('permissions:manage')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.permissions.remove(id);
  }
}
