import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import boom from '@hapi/boom';
import bcrypt from 'bcryptjs';

import { Prisma } from '../config';
import { validationError } from '../adapters';
import { CreateUserReq, LoginUserReq, Token } from '../models';
import { removeTokenDB, tokenValidation } from '../utilities';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(validationError(errors.array()));

    const { username, email, password } = req.body as CreateUserReq;

    const findUsername = await Prisma.user.findUnique({
      where: { username },
    });

    if (findUsername) return next(boom.badRequest('Username already exists'));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(validationError(errors.array()));

    const { username, password } = req.body as LoginUserReq;

    const findUser = await Prisma.user.findUnique({
      where: { username },
    });

    if (!findUser)
      return next(boom.badRequest('Incorrect username or password'));

    const passwordCompare = await bcrypt.compare(password, findUser.password);

    if (!passwordCompare)
      return next(boom.badRequest('Incorrect username or password'));

    const tokenvalidationResult = (await tokenValidation(findUser.id)) as Token;

    if (!tokenvalidationResult) return next(tokenvalidationResult);

    res.cookie('token', tokenvalidationResult['token'], {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ ...findUser, password: undefined });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = res.locals.authorized;

    const findUser = await Prisma.user.findUnique({ where: { id } });

    if (!findUser) return next(boom.badRequest('User not found'));

    await removeTokenDB(id);

    res.clearCookie('token');

    return res.status(200).json({ msg: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const renewToken = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = res.locals.authorized;

    const findUser = await Prisma.user.findUnique({ where: { id } });

    if (!findUser) return next(boom.badRequest('User not found'));

    return res.status(200).json({
      ...findUser,
      password: undefined,
    });
  } catch (error) {
    next(error);
  }
};
