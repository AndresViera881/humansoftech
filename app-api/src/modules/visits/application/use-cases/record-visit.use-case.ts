import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

function parseBrowser(ua: string): string {
  if (!ua) return 'Desconocido';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  return 'Otro';
}

function parseOS(ua: string): string {
  if (!ua) return 'Desconocido';
  if (ua.includes('Windows NT')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Otro';
}

function parseDevice(ua: string): string {
  if (!ua) return 'Desconocido';
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) return 'Móvil';
  if (ua.includes('Tablet') || ua.includes('iPad')) return 'Tablet';
  return 'Escritorio';
}

@Injectable()
export class RecordVisitUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: { page: string; ip: string; userAgent: string; referrer: string }): Promise<any> {
    const { page, ip, userAgent, referrer } = data;
    return this.prisma.pageView.create({
      data: {
        page,
        ip,
        userAgent,
        browser: parseBrowser(userAgent),
        os: parseOS(userAgent),
        device: parseDevice(userAgent),
        referrer: referrer || null,
      },
    });
  }
}
