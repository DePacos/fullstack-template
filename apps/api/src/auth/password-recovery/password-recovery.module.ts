import { Module } from '@nestjs/common';
import { createPasswordRecoveryRouter } from '@template/trpc/server';

import { PasswordRecoveryService } from '@/auth/password-recovery/password-recovery.service';
import { TokensModule } from '@/auth/tokens';
import { MailModule } from '@/mail';
import { UserModule } from '@/user';

export const PASSWORD_RECOVERY_ROUTER = Symbol();

@Module({
  imports: [TokensModule, UserModule, MailModule],
  providers: [
    PasswordRecoveryService,
    {
      provide: PASSWORD_RECOVERY_ROUTER,
      useFactory: (service: PasswordRecoveryService) => createPasswordRecoveryRouter(service),
      inject: [PasswordRecoveryService],
    },
  ],
  exports: [PASSWORD_RECOVERY_ROUTER, PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
