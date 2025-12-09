import { z } from 'zod';

import { TokenSchema } from '../shared.schemas';

export const EmailConfirmationRequestSchema = z.object({
  token: TokenSchema.shape.token,
});

export type EmailConfirmationRequest = z.infer<typeof EmailConfirmationRequestSchema>;
