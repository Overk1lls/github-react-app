import 'reflect-metadata';
import './controllers/auth.controller';
import './controllers/repo.controller';
import './controllers/user.controller';
import { config, isNotProduction } from './lib/config';
import { createApp } from './middlewares/app';

async function start() {
  console.log((isNotProduction() ? 'Development' : 'Production') + ' environment');

  const { PORT } = config;
  const app = createApp();

  app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
}

start().catch(console.error);
