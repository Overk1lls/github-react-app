import { ErrorRequestHandler } from 'express';
import { BindingScopeEnum, Container } from 'inversify';
import { AuthController } from '../controllers/auth.controller';
import { RepoController } from '../controllers/repo.controller';
import { UserController } from '../controllers/user.controller';
import { config } from '../lib/config';
import { Di } from '../lib/di';
import { Optional } from '../lib/types';
import { requestErrorHandler } from '../middlewares/handlers/error.handler';
import { OctokitService } from '../services/octokit.service';
import { types } from './types';

export const defaultScope = BindingScopeEnum.Singleton;

class MainDi extends Di {
  protected createContainer(): Container {
    const container = new Container({
      defaultScope,
      autoBindInjectable: true,
    });

    container.bind<Optional<string>>(types.OctokitToken).toConstantValue(config.OCTOKIT_TOKEN);

    container.bind<OctokitService>(OctokitService).toSelf();

    container.bind<RepoController>(types.RepoController).to(RepoController);

    container.bind<AuthController>(types.AuthController).to(AuthController);

    container.bind<UserController>(types.UserController).to(UserController);

    container
      .bind<ErrorRequestHandler>(types.ErrorHandlingMiddleware)
      .toConstantValue(requestErrorHandler);

    return container;
  }
}

export const di = new MainDi();
export const container = di.getContainer();
