import { z } from 'zod';

import { SendingMailResponseSchema } from '../sending-mail';
import { EmailSchema, PasswordSchema, TokenIdSchema } from '../shared.schemas';

export const SignInRequestSchema = z.object({
  email: EmailSchema.shape.email,
  password: PasswordSchema.shape.password,
});

export const SignInResponseSchema = z.object({
  twoFactorTokenId: TokenIdSchema.shape.tokenId,
  sentMail: SendingMailResponseSchema.shape.sentMail,
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
