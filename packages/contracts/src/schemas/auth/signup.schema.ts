import { z } from 'zod';

import { EmailSchema, PasswordSchema, UserNameSchema } from '../shared.schemas';

export const SignUpRequestSchema = z
  .object({
    name: UserNameSchema.shape.name,
    email: EmailSchema.shape.email,
    password: PasswordSchema.shape.password,
    passwordRepeat: z.string(),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: 'Passwords do not match',
    path: ['passwordRepeat'],
  });

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
