import { Task } from '@prisma/client';

export type CreateTaskReq = Pick<Task, 'title' | 'description'>;
export type UpdateTaskReq = Omit<Task, 'userId' | 'id'>;
