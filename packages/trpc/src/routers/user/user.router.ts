import {
  User,
  UserSchema,
  UserUpdate,
  UserResponseSchema,
  UserResponse,
  UserUpdateSchema,
} from '@template/contracts';
import { z } from 'zod';

import { router, protectedProcedure } from '@/config';

type UserService = {
  getUserById(userId: User['id']): Promise<UserResponse | null>;
  updateUser(userId: User['id'], data: UserUpdate): Promise<UserResponse>;
};

export const createUserRouter = (userService: UserService) =>
  router({
    getUserById: protectedProcedure
      .input(UserSchema.shape.id)
      .output(UserResponseSchema.nullable())
      .query(({ input }) => userService.getUserById(input)),
    updateUser: protectedProcedure
      .input(
        z.object({
          userId: UserSchema.shape.id,
          data: UserUpdateSchema,
        }),
      )
      .output(UserResponseSchema)
      .mutation(({ input }) => userService.updateUser(input.userId, input.data)),
  });

export type UserRouter = ReturnType<typeof createUserRouter>;
