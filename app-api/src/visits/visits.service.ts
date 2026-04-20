import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async record(page: string) {
    return this.prisma.pageView.create({ data: { page } });
  }

  async stats() {
    const total = await this.prisma.pageView.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.prisma.pageView.count({
      where: { visitedAt: { gte: today } },
    });

    const week = new Date();
    week.setDate(week.getDate() - 7);
    const weekCount = await this.prisma.pageView.count({
      where: { visitedAt: { gte: week } },
    });

    const daily = await this.prisma.pageView.groupBy({
      by: ['visitedAt'],
      _count: { id: true },
      orderBy: { visitedAt: 'desc' },
      take: 30,
    });

    return { total, today: todayCount, week: weekCount, daily };
  }
}
