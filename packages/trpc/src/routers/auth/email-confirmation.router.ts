import {
  EmailConfirmationRequest,
  EmailConfirmationRequestSchema,
  ResponseSuccess,
  ResponseSuccessSchema,
  SendingMailResponse,
  SendingMailResponseSchema,
} from '@template/contracts';

import { router, procedure } from '@/config';
import { CreateExpressContextOptions } from '@/server';

type Response = CreateExpressContextOptions['res'];

type EmailConfirmationService = {
  emailConfirmation(input: EmailConfirmationRequest, res: Response): Promise<ResponseSuccess>;
  resendLinkEmailConfirmation(input: EmailConfirmationRequest): Promise<SendingMailResponse>;
};

export const createEmailConfirmationRouter = (emailConfirmationService: EmailConfirmationService) =>
  router({
    emailConfirmation: procedure
      .input(EmailConfirmationRequestSchema)
      .output(ResponseSuccessSchema)
      .mutation(({ input, ctx }) => emailConfirmationService.emailConfirmation(input, ctx.res)),
    resendLinkEmailConfirmation: procedure
      .input(EmailConfirmationRequestSchema)
      .output(SendingMailResponseSchema)
      .mutation(({ input }) => emailConfirmationService.resendLinkEmailConfirmation(input)),
  });

export type EmailConfirmationRouter = ReturnType<typeof createEmailConfirmationRouter>;
