import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PaginationMiddleware } from '../../common/middlewares/paginate.middleware';
import { OctokitModule } from '../octokit/octokit.module';
import { RepoController } from './repo.controller';

@Module({
  imports: [OctokitModule],
  controllers: [RepoController],
})
export class RepoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes(RepoController);
  }
}
