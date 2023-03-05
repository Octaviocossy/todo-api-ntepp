import jwt, { Secret } from 'jsonwebtoken';
import boom from '@hapi/boom';
import { User } from '@prisma/client';

import { Prisma } from '../config';

const tokenExpirationMinutes = 30;

export const generateJWT = (data: { id: User['id'] }) => {
  return jwt.sign(data, process.env.JWT_SECRET as Secret, {
    expiresIn: 60 * tokenExpirationMinutes,
  });
};

const createTimeOfExpiration = () => {
  const expires_at = new Date();

  expires_at.setMinutes(expires_at.getMinutes() + tokenExpirationMinutes);

  return expires_at;
};

const createTokenDB = async (userId: User['id']) => {
  try {
    const token = generateJWT({ id: userId });

    await Prisma.authToken.create({
      data: {
        jwt: token,
        expires_at: createTimeOfExpiration(),
        created_at: new Date(),
        userId,
      },
    });

    return { token };
  } catch (error) {
    return boom.unauthorized('Error creating token in DB');
  }
};

const updateTokenDB = async (userId: User['id']) => {
  try {
    const token = generateJWT({ id: userId });

    const getFirstTokenSession = await Prisma.authToken.findFirst({
      where: { userId },
    });

    await Prisma.authToken.update({
      data: {
        jwt: token,
        expires_at: createTimeOfExpiration(),
        created_at: new Date(),
        userId,
      },
      where: { id: getFirstTokenSession?.id },
    });

    return { token };
  } catch (error) {
    return boom.unauthorized('Error updating token in DB');
  }
};

export const removeTokenDB = async (userId: User['id']) => {
  try {
    const getFirstTokenSession = await Prisma.authToken.findFirst({
      where: { userId },
    });

    await Prisma.authToken.delete({
      where: { id: getFirstTokenSession?.id },
    });

    return;
  } catch (error) {
    return boom.unauthorized('Error removing token in DB');
  }
};

export const tokenValidation = async (userId: User['id']) => {
  try {
    const findTokenSession = await Prisma.authToken.findFirst({
      where: { userId },
    });

    if (findTokenSession && findTokenSession?.expires_at) {
      if (findTokenSession.expires_at < new Date()) {
        // In case the user logs in and has an old token record, it will be updated.
        return await updateTokenDB(userId);
      } else {
        return { token: findTokenSession.jwt };
      }
    } else {
      return await createTokenDB(userId);
    }
  } catch (error) {
    return boom.unauthorized('Error validating token in DB');
  }
};
