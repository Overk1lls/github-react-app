import cors from 'cors';
import apiDoc from '../../docs/api.json';
import { Application, json } from 'express';
import { container } from '../di';
import { InversifyExpressServer } from 'inversify-express-utils';
import { serve, setup } from 'swagger-ui-express';
import { logicErrorHandler } from './handlers/logic-error.handler';
import { requestErrorHandler } from './handlers/error.handler';

export function createApp(): Application {
  const server = new InversifyExpressServer(container, null, { rootPath: '/api/v1' });

  server.setConfig((app) => {
    app.use(cors({ origin: true }));
    app.use(json());
    app.use('/api/v1/docs', serve, setup(apiDoc));
  });
  server.setErrorConfig((app) => {
    app.use(logicErrorHandler);
    app.use(requestErrorHandler);
  });

  const app = server.build();

  return app;
}
