import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import type { IncomingMessage, ServerResponse } from 'http';

const expressApp = express();
let isBootstrapped = false;

async function bootstrap() {
  if (isBootstrapped) return expressApp;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    methods: '*',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.init();
  isBootstrapped = true;
  return expressApp;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const server = await bootstrap();
  server(req, res);
};
