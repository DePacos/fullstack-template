import {
  Token,
  TokenSchema,
  ResponseSuccess,
  SendingMailResponse,
  PasswordRecoveryRequestEmail,
  PasswordRecoveryRequestEmailSchema,
  PasswordRecoveryRequestPassword,
  PasswordRecoveryRequestPasswordSchema,
} from '@template/contracts';
import { z } from 'zod';

import { router, procedure } from '@/config';

type PasswordRecoveryService = {
  sendPasswordRecoveryLink(data: PasswordRecoveryRequestEmail): Promise<SendingMailResponse>;
  passwordRecovery(data: PasswordRecoveryRequestPassword): Promise<ResponseSuccess>;
  resentPasswordRecoveryLink(data: Token['token']): Promise<SendingMailResponse>;
};

export const createPasswordRecoveryRouter = (passwordRecoveryService: PasswordRecoveryService) =>
  router({
    sendPasswordRecoveryLink: procedure
      .input(PasswordRecoveryRequestEmailSchema)
      .mutation(({ input }) => passwordRecoveryService.sendPasswordRecoveryLink(input)),
    passwordRecovery: procedure
      .input(PasswordRecoveryRequestPasswordSchema)
      .mutation(({ input }) => passwordRecoveryService.passwordRecovery(input)),
    resentPasswordRecoveryLink: procedure
      .input(TokenSchema.shape.token)
      .mutation(({ input }) => passwordRecoveryService.resentPasswordRecoveryLink(input)),
  });

export type PasswordRecoveryRouter = ReturnType<typeof createPasswordRecoveryRouter>;
