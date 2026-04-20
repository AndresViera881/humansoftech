import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { UnauthorizedException } from '../../../../shared/domain/exceptions/unauthorized.exception';

@Injectable()
export class MeUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<{ id: string; name: string; email: string; role: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (!user || !user.active) throw new UnauthorizedException();
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    };
  }
}
