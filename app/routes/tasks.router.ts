import express from 'express';
import { check } from 'express-validator';

import { createTask, deleteTask, getTasks, updateTask } from '../controllers';
import { auth } from '../middlewares';

const router = express.Router();

router.get('/get', auth, getTasks);

router.post(
  '/create',
  check('title').not().isEmpty().withMessage('Title is required'),
  check('description').not().isEmpty().withMessage('Description is required'),
  auth,
  createTask
);

router.put(
  '/update/:id',
  check('title').not().isEmpty().withMessage('Title is required'),
  check('description').not().isEmpty().withMessage('Description is required'),
  check('completed').not().isEmpty().withMessage('Completed is required'),
  auth,
  updateTask
);

router.delete('/delete/:id', auth, deleteTask);

export { router as TaskRouter };
