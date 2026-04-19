import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global → /api
  app.setGlobalPrefix('api');

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS abierto para evitar problemas en producción
  app.enableCors({
    origin: true,
    methods: '*',
    credentials: true,
  });

  // Puerto dinámico (IMPORTANTE en Railway)
  const port = process.env.PORT || 4000;

  await app.listen(port, '0.0.0.0');
  console.log(`API running on port ${port}`);
}

bootstrap().catch(err => {
  console.error('Fatal error starting app:', err);
  process.exit(1);
});