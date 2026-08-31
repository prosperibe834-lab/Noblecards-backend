import 'dotenv/config';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/flutterwave/webhook', express.raw({ type: '*/*', limit: '1mb' }));
  app.use(express.json({
    verify: (req: any, _res, buffer) => {
      if (req.originalUrl === '/flutterwave/webhook') {
        req.rawBody = buffer;
      }
    },
  }));
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const configuredOrigins = process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:5173',
    'http://10.0.2.2:3000',
    'http://10.0.2.2:8080',
    'http://10.0.2.2:5173',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || configuredOrigins.includes(origin) || /^https?:\/\/(localhost|10\.0\.2\.2):\d+$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin is not allowed by CORS'));
    },
  });
  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
}
bootstrap();
