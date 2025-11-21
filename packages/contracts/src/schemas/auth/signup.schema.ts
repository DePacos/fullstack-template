import { z } from 'zod';

import { EmailSchema, UserNameSchema, withPasswordConfirmation } from '../shared.schemas';

export const SignUpRequestSchema = withPasswordConfirmation(
  z.object({
    name: UserNameSchema.shape.name,
    email: EmailSchema.shape.email,
  }),
);

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
