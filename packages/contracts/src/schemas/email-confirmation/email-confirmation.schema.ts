import { z } from 'zod';

import { TokenSchema } from '../shared.schemas';

export const EmailConfirmationRequestSchema = z.object({
  token: TokenSchema.shape.token,
});

export const EmailConfirmationResponseSchema = z.object({
  success: z.boolean(),
});

export type EmailConfirmationRequest = z.infer<typeof EmailConfirmationRequestSchema>;
export type EmailConfirmationResponse = z.infer<typeof EmailConfirmationResponseSchema>;
