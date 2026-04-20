import { Module } from '@nestjs/common';
import { RecordVisitUseCase } from './application/use-cases/record-visit.use-case';
import { GetVisitStatsUseCase } from './application/use-cases/get-visit-stats.use-case';
import { VisitsController } from './presentation/visits.controller';

@Module({
  providers: [RecordVisitUseCase, GetVisitStatsUseCase],
  controllers: [VisitsController],
})
export class VisitsModule {}
