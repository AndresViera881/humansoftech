import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

async function bootstrap() {
  console.log('Bootstrap starting...');
  console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);
  console.log('NestJS app created');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
  console.log(`API running on port ${process.env.PORT ?? 4000}`);
}
bootstrap().catch(err => {
  console.error('Fatal error starting app:', err);
  process.exit(1);
});
