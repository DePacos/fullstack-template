import { router } from '@/config';

import {
  AuthRouter,
  EmailConfirmationRouter,
  PasswordRecoveryRouter,
  TwoFactorAuthRouter,
} from './auth';
import { UserRouter } from './user';

export const createAppRouter = (serviceRouter: {
  auth: AuthRouter;
  emailConfirmation: EmailConfirmationRouter;
  passwordRecovery: PasswordRecoveryRouter;
  twoFactorAuth: TwoFactorAuthRouter;
  user: UserRouter;
}) =>
  router({
    auth: serviceRouter.auth,
    emailConfirmation: serviceRouter.emailConfirmation,
    passwordRecovery: serviceRouter.passwordRecovery,
    twoFactorAuth: serviceRouter.twoFactorAuth,
    user: serviceRouter.user,
  });

export type AppRouter = ReturnType<typeof createAppRouter>;
