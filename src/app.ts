import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RequestExceptionsFilter } from './common/filters/request-exception.filter';
import { getLogCategories } from './lib/config';
import { createApiDocument } from './lib/swagger';

export const apiPrefix = '/api/v1';

export async function createApp(originUrl = '') {
  const app = await NestFactory.create(AppModule, {
    logger: getLogCategories(),
    cors: { origin: true },
  });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new RequestExceptionsFilter());

  const document = createApiDocument(app, originUrl);

  SwaggerModule.setup(apiPrefix + '/docs', app, document);

  return app;
}
