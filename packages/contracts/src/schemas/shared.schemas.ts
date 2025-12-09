import { z } from 'zod';

import { PASSWORD_REGEX } from '../constants';

export const UserNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is require' })
    .max(20, { message: 'Name is max 20 character' }),
});

export const EmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is require' })
    .email({ message: 'Email format invalid' }),
});

export const PasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: 'Password is require' })
    .refine((value) => PASSWORD_REGEX.test(value), { message: 'Password format invalid' }),
});

const PasswordConfirmationSchema = z
  .object({
    password: PasswordSchema.shape.password,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export const withPasswordConfirmation = <T extends z.ZodRawShape>(base: z.ZodObject<T>) =>
  base.merge(PasswordConfirmationSchema);

export const UuidSchema = z.uuid();
export const JwtSchema = z.jwt();
export const TokenSchema = z.object({
  id: UuidSchema,
  email: EmailSchema.shape.email,
  token: z.string(),
  type: z.enum(['VERIFICATION', 'TWO_FACTOR', 'PASSWORD_RESET', 'REFRESH']),
  createdAt: z.date(),
  expiresAt: z.date(),
  userId: UuidSchema,
});

export const ResponseSuccessSchema = z.object({
  success: z.boolean(),
});

export const UserRoleSchema = z.enum(['ADMIN', 'USER']);
export const AuthTypeSchema = z.enum(['CREDENTIALS', 'OAUTH']);
export const AuthProviderSchema = z.enum(['LOCAL', 'GOOGLE', 'YANDEX']);

export type UserName = z.infer<typeof UserNameSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Password = z.infer<typeof PasswordSchema>;
export type Uuid = z.infer<typeof UuidSchema>;
export type Token = z.infer<typeof TokenSchema>;
export type Jwt = z.infer<typeof JwtSchema>;
export type ResponseSuccess = z.infer<typeof ResponseSuccessSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type AuthProvider = z.infer<typeof AuthProviderSchema>;
export type AuthType = z.infer<typeof AuthTypeSchema>;
