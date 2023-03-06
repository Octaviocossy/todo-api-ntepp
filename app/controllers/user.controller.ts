import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import boom from '@hapi/boom';
import bcrypt from 'bcryptjs';

import { validationError } from '../adapters';
import { Prisma } from '../config';
import { ChangePasswordReq, UpdateUserReq } from '../models';

export const updateInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(validationError(errors.array()));

    const { id } = res.locals.authorized;

    const { username, email } = req.body as UpdateUserReq;

    const findUser = await Prisma.user.findMany({
      where: { username, NOT: { id } },
    });

    if (findUser.length)
      return next(boom.badRequest('Username already exists'));

    await Prisma.user.update({
      data: {
        username,
        email,
        updated_at: new Date(),
      },
      where: { id },
    });

    return res.status(200).json({ msg: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(validationError(errors.array()));

    const { id } = res.locals.authorized;
    const { password, newPassword } = req.body as ChangePasswordReq;

    const findUser = await Prisma.user.findUnique({
      where: { id },
    });

    if (!findUser) return next(boom.badRequest('User not found'));

    const comparePasswords = await bcrypt.compare(password, findUser.password);

    if (!comparePasswords) return next(boom.badRequest('Incorrect password'));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Prisma.user.update({
      data: {
        password: hashedPassword,
        updated_at: new Date(),
      },
      where: { id },
    });

    return res.status(200).json({ msg: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
