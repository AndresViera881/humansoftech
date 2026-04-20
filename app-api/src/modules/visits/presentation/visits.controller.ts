import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { RecordVisitUseCase } from '../application/use-cases/record-visit.use-case';
import { GetVisitStatsUseCase } from '../application/use-cases/get-visit-stats.use-case';

@Controller('visits')
export class VisitsController {
  constructor(
    private readonly recordVisit: RecordVisitUseCase,
    private readonly getVisitStats: GetVisitStatsUseCase,
  ) {}

  @Post()
  record(@Req() req: Request, @Body() body: { page?: string; referrer?: string }) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] as string ||
      req.ip ||
      'Desconocido';

    const userAgent = req.headers['user-agent'] ?? '';

    return this.recordVisit.execute({
      page: body.page ?? '/',
      ip,
      userAgent,
      referrer: body.referrer ?? '',
    });
  }

  @Get('stats')
  stats() {
    return this.getVisitStats.execute();
  }
}
