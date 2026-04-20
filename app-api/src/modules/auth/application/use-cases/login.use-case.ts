import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { LoginDto } from '../dtos/login.dto';
import { UnauthorizedException } from '../../../../shared/domain/exceptions/unauthorized.exception';
import { hashPassword } from '../../../../shared/utils/hash-password';

@Injectable()
export class LoginUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: LoginDto): Promise<{ user: { id: string; name: string; email: string; role: string } }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const hashed = hashPassword(dto.password);
    if (user.password !== hashed) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }
}
