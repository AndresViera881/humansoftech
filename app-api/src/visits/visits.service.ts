import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async record(data: { page: string; ip: string; userAgent: string; referrer: string }) {
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

  async stats() {
    const total = await this.prisma.pageView.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.prisma.pageView.count({ where: { visitedAt: { gte: today } } });

    const week = new Date();
    week.setDate(week.getDate() - 7);
    const weekCount = await this.prisma.pageView.count({ where: { visitedAt: { gte: week } } });

    // Last 30 visits with details
    const recent = await this.prisma.pageView.findMany({
      orderBy: { visitedAt: 'desc' },
      take: 30,
      select: { id: true, ip: true, browser: true, os: true, device: true, referrer: true, visitedAt: true },
    });

    // Breakdowns
    const [byBrowser, byOS, byDevice] = await Promise.all([
      this.prisma.pageView.groupBy({ by: ['browser'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
      this.prisma.pageView.groupBy({ by: ['os'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
      this.prisma.pageView.groupBy({ by: ['device'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    ]);

    return {
      total,
      today: todayCount,
      week: weekCount,
      recent,
      byBrowser: byBrowser.map(r => ({ label: r.browser ?? 'Desconocido', count: r._count.id })),
      byOS: byOS.map(r => ({ label: r.os ?? 'Desconocido', count: r._count.id })),
      byDevice: byDevice.map(r => ({ label: r.device ?? 'Desconocido', count: r._count.id })),
    };
  }
}
