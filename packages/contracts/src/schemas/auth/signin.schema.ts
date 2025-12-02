import { z } from 'zod';

import { SendingMailResponseSchema } from '../sending-mail';
import { EmailSchema, PasswordSchema, UuidSchema } from '../shared.schemas';

export const SignInRequestSchema = z.object({
  email: EmailSchema.shape.email,
  password: PasswordSchema.shape.password,
});

export const SignInResponseSchema = z.object({
  auth: z.literal(['auth', '2fa']),
  sentMail: SendingMailResponseSchema.shape.sentMail.optional(),
  twoFactorTokenId: UuidSchema.optional(),
  expiresAt: z.number().optional(),
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
