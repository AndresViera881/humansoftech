import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Permissions } from '../../shared/auth/decorators/permissions.decorator';

@Controller('menus')
export class MenusController {
  constructor(private readonly menus: MenusService) {}

  @Get()
  findAll() {
    return this.menus.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menus.findOne(id);
  }

  @Permissions('menus:manage')
  @Post()
  create(@Body() dto: CreateMenuDto) {
    return this.menus.create(dto);
  }

  @Permissions('menus:manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menus.update(id, dto);
  }

  @Permissions('menus:manage')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.menus.remove(id);
  }
}
