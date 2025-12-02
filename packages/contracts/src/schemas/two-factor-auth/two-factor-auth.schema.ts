import { z } from 'zod';

import { UuidSchema } from '../shared.schemas';

export const TwoFactorAuthRequestSchema = z.object({
  tokenId: UuidSchema,
  code: z.string().min(6, { message: '' }),
});

export type TwoFactorAuthRequest = z.infer<typeof TwoFactorAuthRequestSchema>;
