import express, { Express } from 'express';

import { AuthRouter } from './auth.router';
import { TaskRouter } from './tasks.router';
import { UserRouter } from './user.router';

export const Router = (app: Express) => {
  const router = express.Router();

  app.use('/api/v1', router);

  router.use('/auth', AuthRouter);
  router.use('/user', UserRouter);
  router.use('/tasks', TaskRouter);
};
