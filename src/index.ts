import { config } from "./lib/config";
import { createApp } from "./middlewares";

const start = async () => {
  const { PORT } = config;
  const app = createApp();

  app.listen(PORT, () => console.info(`App is running on port: ${PORT}`));
};

start().catch(console.error);