import { Controller, Post, Get, Body } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly service: VisitsService) {}

  @Post()
  record(@Body('page') page: string) {
    return this.service.record(page ?? '/');
  }

  @Get('stats')
  stats() {
    return this.service.stats();
  }
}
