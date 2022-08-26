import express, { Express } from 'express';
import cors from 'cors';
import getBranchesRoute from './routes.ts/branches';
import getCommitsRoute from './routes.ts/commits';
import getRepositoriesRoute from './routes.ts/repos';
import authorizeRoute from './routes.ts/authorize';
import apiDoc from '../../docs/api.json';
import { createDependencies } from '../di';
import { requestErrorHandler } from './handlers/error.handler';
import { serve, setup } from 'swagger-ui-express';
import { Parameters } from '../lib/const';
import getUserRoute from './routes.ts/user';

export function createApp(): Express {
  const app = express();
  const { octokitService } = createDependencies();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.get(
    `/api/v1/repos/by-owner/:${Parameters.Owner}/:${Parameters.Repo}/branches`,
    getBranchesRoute(octokitService)
  );
  app.get(
    `/api/v1/repos/by-owner/:${Parameters.Owner}/:${Parameters.Repo}/commits`,
    getCommitsRoute(octokitService)
  );
  app.get(
    `/api/v1/repos/by-org/:${Parameters.Org}`,
    getRepositoriesRoute(octokitService)
  );
  app.get('/api/v1/user', getUserRoute(octokitService));
  app.post('/api/v1/auth', authorizeRoute(octokitService));
  app.use('/api/v1/docs', serve, setup(apiDoc));
  app.use(requestErrorHandler);

  return app;
};
