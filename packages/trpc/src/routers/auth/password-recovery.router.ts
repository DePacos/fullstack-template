import {
  ResponseSuccess,
  SendingMailResponse,
  PasswordRecoveryRequestEmail,
  PasswordRecoveryRequestEmailSchema,
  PasswordRecoveryRequestPassword,
  PasswordRecoveryRequestPasswordSchema,
  TokenSchema,
  Token,
} from '@template/contracts';

import { router, procedure } from '@/config';

type PasswordRecoveryService = {
  sendPasswordRecoveryLink(data: PasswordRecoveryRequestEmail): Promise<SendingMailResponse>;
  passwordRecovery(data: PasswordRecoveryRequestPassword): Promise<ResponseSuccess>;
  resentPasswordRecoveryLink(data: Token): Promise<SendingMailResponse>;
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
      .input(TokenSchema)
      .mutation(({ input }) => passwordRecoveryService.resentPasswordRecoveryLink(input)),
  });

export type PasswordRecoveryRouter = ReturnType<typeof createPasswordRecoveryRouter>;
