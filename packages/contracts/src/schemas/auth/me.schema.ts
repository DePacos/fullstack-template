import { z } from 'zod';

export const MeResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    role: z.enum(['ADMIN', 'USER']),
  })
  .strict();

export type Me = z.infer<typeof MeResponseSchema>;
