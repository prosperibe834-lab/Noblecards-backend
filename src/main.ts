import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const configuredOrigins = process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:5173',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || configuredOrigins.includes(origin) || /^https?:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin is not allowed by CORS'));
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
