import { Module } from '@nestjs/common';
import { createTwoFactorAuthRouter } from '@template/trpc/server';

import { TokensModule } from '@/auth/tokens';
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service';
import { MailModule } from '@/mail';
import { UserModule } from '@/user';

export const TWO_FACTOR_AUTH_ROUTER = Symbol();

@Module({
  imports: [UserModule, TokensModule, MailModule],
  providers: [
    TwoFactorAuthService,
    {
      provide: TWO_FACTOR_AUTH_ROUTER,
      useFactory: (service) => createTwoFactorAuthRouter(service),
      inject: [TwoFactorAuthService],
    },
  ],
  exports: [TwoFactorAuthService, TWO_FACTOR_AUTH_ROUTER],
})
export class TwoFactorAuthModule {}
