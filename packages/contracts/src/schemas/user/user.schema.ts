import { z } from 'zod';

import { UserNameSchema, EmailSchema, PasswordSchema, UuidSchema } from '../shared.schemas';

export const UserSchema = z.object({
  id: UuidSchema,
  name: UserNameSchema.shape.name,
  email: EmailSchema.shape.email,
  password: PasswordSchema.shape.password.nullable(),
  avatar: z.string().nullable(),
  role: z.enum(['ADMIN', 'USER']),
  isVerified: z.boolean(),
  isTwoFactorEnable: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserUpdateSchema = z.object({
  name: UserSchema.shape.name.optional(),
  avatar: UserSchema.shape.avatar.optional(),
  isTwoFactorEnable: UserSchema.shape.isTwoFactorEnable.optional(),
});

export const UserResponseSchema = UserSchema.omit({ password: true, isVerified: true });

export type User = z.infer<typeof UserSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
