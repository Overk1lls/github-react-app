import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestExceptionsFilter } from './common/filters/exception.filter';
import { getLogCategories } from './lib/config';

export const apiPrefix = '/api/v1';

export async function createApp(originUrl = '') {
  const app = await NestFactory.create(AppModule, {
    logger: getLogCategories(),
    cors: { origin: true },
  });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new RequestExceptionsFilter());


  return app;
}
