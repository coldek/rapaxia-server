import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { useContainer } from 'class-validator';
import { Container } from 'typedi'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());
  await app.listen(8000);
}

bootstrap();
