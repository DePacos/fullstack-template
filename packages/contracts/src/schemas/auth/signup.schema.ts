import { z } from 'zod';

import { EmailSchema, PasswordConfirmationSchema, UserNameSchema } from '../shared.schemas';

export const SignUpRequestSchema = PasswordConfirmationSchema.safeExtend({
  name: UserNameSchema.shape.name,
  email: EmailSchema.shape.email,
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
