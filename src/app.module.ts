import joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './components/auth/auth.module';
import { OctokitModule } from './components/octokit/octokit.module';
import { RepoModule } from './components/repo/repo.module';
import { UserModule } from './components/user/user.module';
import { githubConfig, httpConfig, isNotProduction } from './lib/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env',
      load: [githubConfig, httpConfig],
      isGlobal: true,
      cache: !isNotProduction(),
      validationSchema: joi.object({
        PORT: joi.number().default(8080),
        OCTOKIT_TOKEN: joi.string().required(),
        AUTH_CLIENT_ID: joi.string().required(),
        AUTH_CLIENT_SECRET: joi.string().required(),
        ORIGIN_URL: joi.string(),
      }),
    }),
    OctokitModule,
    AuthModule,
    RepoModule,
    UserModule,
  ],
})
export class AppModule {}
