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

export const TokenSchema = z.object({
  token: z.string(),
});

export type UserName = z.infer<typeof UserNameSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Password = z.infer<typeof PasswordSchema>;
export type Token = z.infer<typeof TokenSchema>;
