import { z } from 'zod';

export const MeResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: z.enum(['ADMIN', 'USER']),
});

export type Me = z.infer<typeof MeResponseSchema>;
