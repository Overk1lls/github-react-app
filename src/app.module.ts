import joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './components/auth/auth.module';
import { OctokitModule } from './components/octokit/octokit.module';
import { RepoModule } from './components/repo/repo.module';
import { UserModule } from './components/user/user.module';
import { githubConfig, httpConfig, isNotProduction } from './lib/config';
import { APP_GUARD } from '@nestjs/core';

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
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL') || 60,
        limit: config.get('THROTTLE_LIMIT') || 10,
      }),
    }),
    OctokitModule,
    AuthModule,
    RepoModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
