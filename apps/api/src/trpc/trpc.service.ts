import { Inject, Injectable } from '@nestjs/common';
import {
  createAppRouter,
  AppRouter,
  AuthRouter,
  EmailConfirmationRouter,
  PasswordRecoveryRouter,
  TwoFactorAuthRouter,
  UserRouter,
} from '@template/trpc/server';
import { ExtendedTrpcContext } from '@template/trpc/server';
import { CreateExpressContextOptions } from '@template/trpc/shared';

import { AUTH_ROUTER } from '@/auth';
import { EMAIL_CONFIRMATION_ROUTER } from '@/auth/email-confirmation';
import { PASSWORD_RECOVERY_ROUTER } from '@/auth/password-recovery';
import { TokensService } from '@/auth/tokens';
import { TWO_FACTOR_AUTH_ROUTER } from '@/auth/two-factor-auth';
import { USER_ROUTER, UserService } from '@/user';

@Injectable()
export class TrpcService {
  public readonly appRouter: AppRouter;

  constructor(
    private readonly tokensService: TokensService,
    private readonly userService: UserService,
    @Inject(AUTH_ROUTER) authRouter: AuthRouter,
    @Inject(EMAIL_CONFIRMATION_ROUTER) emailConfirmationRouter: EmailConfirmationRouter,
    @Inject(PASSWORD_RECOVERY_ROUTER) passwordRecoveryRouter: PasswordRecoveryRouter,
    @Inject(TWO_FACTOR_AUTH_ROUTER) twoFactorRouter: TwoFactorAuthRouter,
    @Inject(USER_ROUTER) userRouter: UserRouter,
  ) {
    this.appRouter = createAppRouter({
      auth: authRouter,
      emailConfirmation: emailConfirmationRouter,
      passwordRecovery: passwordRecoveryRouter,
      twoFactorAuth: twoFactorRouter,
      user: userRouter,
    });
  }

  createContext = ({ req, res, info }: CreateExpressContextOptions): ExtendedTrpcContext => ({
    req,
    res,
    info,
    services: {
      tokensService: this.tokensService,
      userService: this.userService,
    },
  });
}
