import { z } from 'zod';

export const SendingMailResponseSchema = z.object({
  sentMail: z.boolean(),
});

export type SendingMailResponse = z.infer<typeof SendingMailResponseSchema>;
