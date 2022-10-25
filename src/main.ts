import 'source-map-support';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { getLogCategories, isNotProduction } from './lib/config';
import { RequestExceptionsFilter } from './common/filters/request-exception.filter';
import { createApiDocument } from './lib/swagger';
import { SwaggerModule } from '@nestjs/swagger';

export const apiPrefix = '/api/v1';

async function bootstrap() {
  console.log((isNotProduction() ? 'Development' : 'Production') + ' environment');

  const app = await NestFactory.create(AppModule, {
    logger: getLogCategories(),
    cors: { origin: true },
  });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new RequestExceptionsFilter());

  const configService = app.get(ConfigService);

  const apiDoc = createApiDocument(app, configService.get<string>('ORIGIN_URL'));
  SwaggerModule.setup(apiPrefix + '/docs', app, apiDoc);

  const apiPort = configService.get<string>('PORT', '8080');

  await app.listen(apiPort, () => console.log(`App has been bootstrapped on port: ${apiPort}`));
}

bootstrap().catch(console.error);
