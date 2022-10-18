import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getLogCategories } from './lib/config';

export async function createApp(prefix = '') {
  const app = await NestFactory.create(AppModule, {
    logger: getLogCategories(),
    cors: { origin: true },
  });
  app.setGlobalPrefix(prefix);

  return app;
}
