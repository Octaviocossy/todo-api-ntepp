import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import boom from '@hapi/boom';
import validator from 'validator';

import { validationError } from '../adapters';
import { Prisma } from '../config';
import { CreateTaskReq, UpdateTaskReq } from '../models';

export const getTasks = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = res.locals.authorized;

    const findTasksById = await Prisma.task.findMany({
      where: { userId: id },
    });

    res.status(200).json(findTasksById);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(validationError(errors.array()));

    const { id } = res.locals.authorized;
    const { title, description } = req.body as CreateTaskReq;

    await Prisma.task.create({
      data: {
        title,
        description,
        userId: id,
      },
    });

    return res.status(200).json({ msg: 'Task created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(validationError(errors.array()));

    const { id } = res.locals.authorized;
    const { id: taskId } = req.params;
    const { title, description, completed } = req.body as UpdateTaskReq;

    if (!validator.isUUID(taskId))
      return next(boom.badRequest('Not a valid task id'));

    const verifyUserTask = await Prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!verifyUserTask) return next(boom.badRequest('Task not found'));

    if (verifyUserTask?.userId !== id)
      return next(boom.badRequest('Task not corresponding to the user id'));

    await Prisma.task.update({
      data: {
        title,
        description,
        completed,
      },
      where: { id: taskId },
    });

    return res.status(200).json({ msg: 'Task updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(validationError(errors.array()));

    const { id } = res.locals.authorized;
    const { id: taskId } = req.params;

    if (!validator.isUUID(taskId))
      return next(boom.badRequest('Not a valid task id'));

    const verifyUserTask = await Prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!verifyUserTask) return next(boom.badRequest('Task not found'));

    if (verifyUserTask?.userId !== id)
      return next(boom.badRequest('Task not corresponding to the user id'));

    await Prisma.task.delete({
      where: { id: taskId },
    });

    return res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
