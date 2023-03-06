import express from 'express';
import { check } from 'express-validator';

import { changePassword, updateInfo } from '../controllers/user.controller';
import { auth } from '../middlewares';

const router = express.Router();

router.post(
  '/updateInfo',
  check('username').not().isEmpty().withMessage('Username is required'),
  check('email').isEmail().not().isEmpty().withMessage('Email is required'),
  auth,
  updateInfo
);

router.post(
  '/changePassword',
  check('password').not().isEmpty().withMessage('Password is required'),
  check('newPassword').not().isEmpty().withMessage('New password is required'),
  auth,
  changePassword
);

export { router as UserRouter };
