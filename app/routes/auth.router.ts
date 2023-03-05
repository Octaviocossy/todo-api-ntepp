import express from 'express';
import { check } from 'express-validator';

import { createUser, loginUser, logoutUser, renewToken } from '../controllers';
import { auth } from '../middlewares';

const router = express.Router();

router.post(
  '/register',
  check('username').not().isEmpty().withMessage('Username is required'),
  check('email').isEmail().not().isEmpty().withMessage('Email is required'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  createUser
);

router.post(
  '/login',
  check('username').not().isEmpty().withMessage('Username is required'),
  check('password').not().isEmpty().withMessage('Password is required'),
  loginUser
);

router.get('/logout', auth, logoutUser);

router.get('/renewtoken', auth, renewToken);

export { router as AuthRouter };
