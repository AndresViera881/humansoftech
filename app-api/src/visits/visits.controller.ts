import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly service: VisitsService) {}

  @Post()
  record(@Req() req: Request, @Body() body: { page?: string; referrer?: string }) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] as string ||
      req.ip ||
      'Desconocido';

    const userAgent = req.headers['user-agent'] ?? '';

    return this.service.record({
      page: body.page ?? '/',
      ip,
      userAgent,
      referrer: body.referrer ?? '',
    });
  }

  @Get('stats')
  stats() {
    return this.service.stats();
  }
}
