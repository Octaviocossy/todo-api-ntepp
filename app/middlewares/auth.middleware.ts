import jwt, { Secret } from 'jsonwebtoken';
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { cookie } = req.headers;

  if (!cookie) return next(boom.unauthorized('Token is required'));

  const token = cookie?.split('=')[1] as string;

  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET as Secret);

    res.locals.authorized = jwtPayload;

    next();
  } catch (error) {
    return next(boom.unauthorized('Token expired or is not valid'));
  }
};
