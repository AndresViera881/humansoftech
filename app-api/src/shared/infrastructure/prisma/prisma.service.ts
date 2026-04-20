import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('DB connect timeout after 5s')), 5000),
    );
    try {
      await Promise.race([this.$connect(), timeout]);
      this.logger.log('Database connected');
    } catch (error: any) {
      this.logger.warn('DB connection deferred:', error?.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
