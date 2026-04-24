import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const roleWithPerms = await this.prisma.role.findFirst({
      where: { name: user.role },
      include: { rolePerms: { include: { permission: true } } },
    });

    if (!roleWithPerms) throw new ForbiddenException();

    const userPerms = roleWithPerms.rolePerms.map(rp => rp.permission.name);
    return required.every(p => userPerms.includes(p));
  }
}
