import { Module } from '@nestjs/common';
import { createEmailConfirmationRouter } from '@template/trpc/server';

import { TokensModule } from '@/auth/tokens';
import { MailModule } from '@/mail';
import { UserModule } from '@/user';

import { EmailConfirmationService } from './email-confirmation.service';

export const EMAIL_CONFIRMATION_ROUTER = Symbol();

@Module({
  imports: [UserModule, TokensModule, MailModule],
  providers: [
    EmailConfirmationService,
    {
      provide: EMAIL_CONFIRMATION_ROUTER,
      useFactory: (service: EmailConfirmationService) => createEmailConfirmationRouter(service),
      inject: [EmailConfirmationService],
    },
  ],
  exports: [EmailConfirmationService, EMAIL_CONFIRMATION_ROUTER],
})
export class EmailConfirmationModule {}
