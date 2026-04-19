import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err?.message, err?.stack);
});
process.on('unhandledRejection', (reason: any) => {
  console.error('UNHANDLED REJECTION:', reason?.message ?? reason);
});

async function bootstrap() {
  console.log('Starting NestJS...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'https://humansoftech-frontend-production-334d.up.railway.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`API running on port ${port}`);
}

bootstrap().catch(err => {
  console.error('Fatal error starting app:', err?.message, err?.stack);
  process.exit(1);
});
