import express, { Express } from 'express';

import { AuthRouter } from './auth.router';

export const Router = (app: Express) => {
  const router = express.Router();

  app.use('/api/v1', router);

  router.use('/auth', AuthRouter);
};
