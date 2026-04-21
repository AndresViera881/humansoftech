import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { UnauthorizedException } from '../../../../shared/domain/exceptions/unauthorized.exception';
import { BadRequestException } from '@nestjs/common';
import { hashPassword } from '../../../../shared/utils/hash-password';

@Injectable()
export class ChangePasswordUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });

    if (!user || !user.active) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.password !== hashPassword(dto.currentPassword)) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { password: hashPassword(dto.newPassword) },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }
}
