import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { LoginDto } from '../dtos/login.dto';
import { UnauthorizedException } from '../../../../shared/domain/exceptions/unauthorized.exception';
import { hashPassword } from '../../../../shared/utils/hash-password';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { cedula: dto.cedula },
      include: {
        role: {
          include: {
            roleMenus: {
              include: {
                menu: {
                  include: { children: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
                },
              },
              where: { menu: { active: true, parentId: null } },
              orderBy: { menu: { sortOrder: 'asc' } },
            },
            rolePerms: { include: { permission: true } },
          },
        },
      },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const hashed = hashPassword(dto.password);
    if (user.password !== hashed) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = this.jwt.sign({ sub: user.id, email: user.email, role: user.role.name });

    const menus = user.role.roleMenus.map(rm => ({
      id: rm.menu.id,
      label: rm.menu.label,
      icon: rm.menu.icon,
      path: rm.menu.path,
      children: rm.menu.children.map(c => ({
        id: c.id,
        label: c.label,
        icon: c.icon,
        path: c.path,
      })),
    }));

    const permissions = user.role.rolePerms.map(rp => rp.permission.name);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cedula: user.cedula,
        role: user.role.name,
        photo: user.photo,
      },
      menus,
      permissions,
    };
  }
}
