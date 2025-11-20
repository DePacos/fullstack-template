import { z } from 'zod';

export const TwoFactorAuthRequestSchema = z.object({
  tokenId: z.uuid(),
  code: z.string().min(1, { message: 'Code is require' }).max(6, { message: 'Code max value 6' }),
});

export type TwoFactorAuthRequest = z.infer<typeof TwoFactorAuthRequestSchema>;
