import { z } from 'zod';

import { TokenIdSchema } from '../shared.schemas';

export const TwoFactorAuthRequestSchema = z.object({
  tokenId: TokenIdSchema.shape.tokenId,
  code: z.string().min(6, { message: '' }),
});

export type TwoFactorAuthRequest = z.infer<typeof TwoFactorAuthRequestSchema>;
