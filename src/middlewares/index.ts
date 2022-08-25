import express, { Express } from 'express';
import cors from 'cors';

export const createApp = (): Express => {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.use('/', (req, res) => {
    res.sendStatus(200);
  });

  return app;
};