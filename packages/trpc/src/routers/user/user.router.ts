import { User, UserSchema, UserUpdate, UserUpdateSchema } from '@template/contracts';
import { z } from 'zod';

import { router, procedure } from '@/config';

type UserService = {
  getUserById(userId: User['id']): Promise<Omit<User, 'password' | 'isVerified'>>;
  updateUser(userId: User['id'], data: UserUpdate): Promise<Omit<User, 'password' | 'isVerified'>>;
};

export const createUserRouter = (userService: UserService) =>
  router({
    getUserById: procedure
      .input(UserSchema.shape.id)
      .output(UserSchema.omit({ password: true, isVerified: true }))
      .mutation(({ input }) => userService.getUserById(input)),
    updateUser: procedure
      .input(
        z.object({
          userId: UserSchema.shape.id,
          data: UserUpdateSchema,
        }),
      )
      .output(UserSchema.omit({ password: true, isVerified: true }))
      .mutation(({ input }) => userService.updateUser(input.userId, input.data)),
  });

export type UserRouter = ReturnType<typeof createUserRouter>;
