import { User } from '@prisma/client';

export type CreateUserReq = Pick<User, 'username' | 'email' | 'password'>;
export type LoginUserReq = Pick<User, 'username' | 'password'>;
export type UpdateUserReq = Pick<User, 'username' | 'email'>;

export interface ChangePasswordReq {
  password: User['password'];
  newPassword: User['password'];
}
