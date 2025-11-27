import { router } from '@/config';

import { AuthRouter, EmailConfirmationRouter, PasswordRecoveryRouter } from './auth';
import { UserRouter } from './user';

export const createAppRouter = (serviceRouter: {
  auth: AuthRouter;
  emailConfirmation: EmailConfirmationRouter;
  passwordRecovery: PasswordRecoveryRouter;
  user: UserRouter;
}) =>
  router({
    auth: serviceRouter.auth,
    emailConfirmation: serviceRouter.emailConfirmation,
    passwordRecovery: serviceRouter.passwordRecovery,
    user: serviceRouter.user,
  });

export type AppRouter = ReturnType<typeof createAppRouter>;
