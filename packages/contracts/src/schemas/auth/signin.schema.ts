import { z } from 'zod';

import { SendingMailResponseSchema } from '../sending-mail';
import { EmailSchema, PasswordSchema, TokenSchema } from '../shared.schemas';

export const SignInRequestSchema = z.object({
  email: EmailSchema.shape.email,
  password: PasswordSchema.shape.password,
});

export const SignInResponseSchema = z.object({
  accessToken: TokenSchema.shape.token.optional(),
  twoFactorTokenId: TokenSchema.shape.token.optional(),
  sentMail: SendingMailResponseSchema.shape.sentMail.optional(),
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
