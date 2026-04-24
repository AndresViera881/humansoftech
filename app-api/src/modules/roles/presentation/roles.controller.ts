import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { FindRolesUseCase } from '../application/use-cases/find-roles.use-case';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Permissions } from '../../../shared/auth/decorators/permissions.decorator';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly findRoles: FindRolesUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  findAll() {
    return this.findRoles.execute();
  }

  @Get(':id/access')
  async getAccess(@Param('id') id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        roleMenus: { include: { menu: true } },
        rolePerms: { include: { permission: true } },
      },
    });
    return {
      menuIds: role?.roleMenus.map(rm => rm.menuId) ?? [],
      permissionIds: role?.rolePerms.map(rp => rp.permissionId) ?? [],
    };
  }

  @Permissions('roles:manage')
  @Put(':id/menus')
  async setMenus(@Param('id') id: string, @Body() body: { menuIds: string[] }) {
    await this.prisma.roleMenu.deleteMany({ where: { roleId: id } });
    if (body.menuIds.length > 0) {
      await this.prisma.roleMenu.createMany({
        data: body.menuIds.map(menuId => ({ roleId: id, menuId })),
      });
    }
    return { success: true };
  }

  @Permissions('roles:manage')
  @Put(':id/permissions')
  async setPermissions(@Param('id') id: string, @Body() body: { permissionIds: string[] }) {
    await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    if (body.permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: body.permissionIds.map(permissionId => ({ roleId: id, permissionId })),
      });
    }
    return { success: true };
  }
}
