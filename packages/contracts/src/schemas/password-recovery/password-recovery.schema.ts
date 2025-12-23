import { z } from 'zod';

import { EmailSchema, TokenSchema, PasswordConfirmationSchema } from '../shared.schemas';

export const PasswordRecoveryRequestEmailSchema = z.object({
  email: EmailSchema.shape.email,
});

export const PasswordRecoveryRequestPasswordSchema = PasswordConfirmationSchema.safeExtend({
  token: TokenSchema.shape.token,
});

export type PasswordRecoveryRequestEmail = z.infer<typeof PasswordRecoveryRequestEmailSchema>;
export type PasswordRecoveryRequestPassword = z.infer<typeof PasswordRecoveryRequestPasswordSchema>;
