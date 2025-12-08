import {
  TwoFactorAuthRequest,
  TwoFactorAuthRequestSchema,
  Uuid,
  UuidSchema,
  SignInResponse,
} from '@template/contracts';

import { router, procedure } from '@/config';
import { CreateExpressContextOptions } from '@/shared';

type Response = CreateExpressContextOptions['res'];

type TwoFactorAuthService = {
  twoFactorAuth(data: TwoFactorAuthRequest, res: Response): Promise<void>;
  resendMailTwoFactorAuth(tokenId: Uuid): Promise<SignInResponse>;
};

export const createTwoFactorAuthRouter = (twoFactorAuthService: TwoFactorAuthService) =>
  router({
    twoFactorAuth: procedure
      .input(TwoFactorAuthRequestSchema)
      .mutation(({ input, ctx }) => twoFactorAuthService.twoFactorAuth(input, ctx.res)),
    resendMailTwoFactorAuth: procedure
      .input(UuidSchema)
      .mutation(({ input }) => twoFactorAuthService.resendMailTwoFactorAuth(input)),
  });

export type TwoFactorAuthRouter = ReturnType<typeof createTwoFactorAuthRouter>;
