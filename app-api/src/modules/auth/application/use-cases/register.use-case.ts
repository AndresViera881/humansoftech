import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { RegisterDto } from '../dtos/register.dto';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { hashPassword } from '../../../../shared/utils/hash-password';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: RegisterDto): Promise<{ user: { id: string; name: string; email: string; role: string; photo: string | null } }> {
    const existing = await this.prisma.user.findUnique({ where: { cedula: dto.cedula } });
    if (existing) throw new ConflictException('Ya existe una cuenta con esa cédula');

    const customerRole = await this.prisma.role.findUnique({ where: { name: 'customer' } });
    if (!customerRole) throw new ConflictException('Rol de cliente no encontrado');

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email ?? `${dto.cedula}@humansoftechs.com`,
        cedula: dto.cedula,
        password: hashPassword(dto.password),
        roleId: customerRole.id,
        active: true,
      },
      include: { role: true },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        photo: user.photo,
      },
    };
  }
}
