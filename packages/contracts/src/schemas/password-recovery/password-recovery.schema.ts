import { z } from 'zod';

import { EmailSchema, withPasswordConfirmation, TokenSchema } from '../shared.schemas';

export const PasswordRecoveryRequestEmailSchema = z.object({
  email: EmailSchema.shape.email,
});

export const PasswordRecoveryRequestPasswordSchema = withPasswordConfirmation(
  z.object({
    token: TokenSchema.shape.token,
  }),
);

export type PasswordRecoveryRequestEmail = z.infer<typeof PasswordRecoveryRequestEmailSchema>;
export type PasswordRecoveryRequestPassword = z.infer<typeof PasswordRecoveryRequestPasswordSchema>;
