import { User } from '@prisma/client';

export type CreateUserReq = Pick<User, 'username' | 'email' | 'password'>;
export type LoginUserReq = Pick<User, 'username' | 'password'>;
