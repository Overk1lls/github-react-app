import { createApp } from '../app';
import { config, isNotProduction } from '../lib/config';

const { PORT, ORIGIN_URL } = config;

async function bootstrap() {
  console.log((isNotProduction() ? 'Development' : 'Production') + ' environment');

  const app = await createApp(ORIGIN_URL);

  await app.listen(PORT, () => console.log(`App has been bootstrapped on port: ${PORT}`));
}

bootstrap().catch(console.error);
