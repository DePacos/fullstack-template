import { z } from 'zod';

import { TokenSchema } from '../shared.schemas';

export const EmailConfirmationRequestSchema = z.object({
  token: TokenSchema,
});

export type EmailConfirmationRequest = z.infer<typeof EmailConfirmationRequestSchema>;
