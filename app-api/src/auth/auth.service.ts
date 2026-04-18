import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

function hashPassword(raw: string): string {
  return createHash('sha256').update(raw + (process.env.PASSWORD_SALT ?? 'humansoftech_salt')).digest('hex');
}

export { hashPassword };

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
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

  async me(userId: string) {
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
