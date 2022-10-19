import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export enum ApiTags {
  AUTH = 'Auth',
  ORG = 'Organiations',
  REPO = 'Repositories',
  BRANCH = 'Branches',
  COMMIT = 'Commits',
  USER = 'Users',
}

export function createApiDocument(app: INestApplication, originUrl = '') {
  const config = new DocumentBuilder()
    .setVersion('1.0.0')
    .setTitle('Github React App Docs')
    .setDescription('The application API description')
    .setTermsOfService('http://swagger.io/terms/')
    .setContact('Yurii Pakhota', '-', 'ov3rfordream@gmail.com')
    .setLicense('MIT', 'https://github.com/Overk1lls/github-react-app/blob/master/LICENSE')
    .addServer('', 'The local server')
    .addServer('{originUrl}', 'The deployment server', {
      originUrl: {
        description: 'Origin URL',
        default: originUrl,
      },
    })
    .addTag(ApiTags.AUTH, 'Everything related to authorization and authentication')
    .addTag(ApiTags.ORG, 'Any remote Git organization')
    .addTag(ApiTags.REPO, 'Any remote Git repository')
    .addTag(ApiTags.BRANCH, "One of any Git repository's branches")
    .addTag(ApiTags.COMMIT, "One of any Git repository branch's commits")
    .addTag(ApiTags.USER, 'Everything related to users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'Token',
      },
      'Bearer'
    )
    .build();

  return SwaggerModule.createDocument(app, config);
}
