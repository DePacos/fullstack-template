import { z } from 'zod';

import { TokenSchema } from '../shared.schemas';

export const UpdateTokenResponseSchema = z.object({
  accessToken: TokenSchema.shape.token,
});

export type UpdateTokenResponse = z.infer<typeof UpdateTokenResponseSchema>;
