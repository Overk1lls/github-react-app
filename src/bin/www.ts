import { createApp } from '../app';
import { config, isNotProduction } from '../lib/config';

const { PORT } = config;

async function bootstrap() {
  console.log((isNotProduction() ? 'Development' : 'Production') + ' environment');

  const app = await createApp('/api/v1');

  await app.listen(PORT, () => console.log(`App has been bootstrapped on port: ${PORT}`));
}

bootstrap().catch(console.error);
