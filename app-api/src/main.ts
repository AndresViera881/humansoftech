import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    : true;

  app.enableCors({
    origin: allowedOrigins,
    methods: ['*'],
  });

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
  console.log(`API running on port ${process.env.PORT ?? 4000}`);
}
bootstrap().catch(err => {
  console.error('Fatal error starting app:', err);
  process.exit(1);
});
