import { config, isNotProduction } from "./lib/config";
import { createApp } from "./middlewares";

async function start() {
  console.log((isNotProduction() ? 'Development' : 'Production') + ' environment');

  const { port } = config;
  const app = createApp();

  app.listen(port, () => console.log(`App is running on port: ${port}`));
}

start().catch(console.error);