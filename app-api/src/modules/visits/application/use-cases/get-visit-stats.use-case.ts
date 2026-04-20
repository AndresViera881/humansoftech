import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class GetVisitStatsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<any> {
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
