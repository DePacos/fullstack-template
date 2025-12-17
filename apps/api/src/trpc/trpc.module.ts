import { Module } from '@nestjs/common';

import { EmailConfirmationModule } from '@/auth/email-confirmation';
import { PasswordRecoveryModule } from '@/auth/password-recovery';
import { TokensModule } from '@/auth/tokens';
import { TwoFactorAuthModule } from '@/auth/two-factor-auth';
import { UserModule } from '@/user';

import { AuthModule } from '@/auth/auth.module';

import { TrpcService } from './trpc.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TokensModule,
    EmailConfirmationModule,
    PasswordRecoveryModule,
    TwoFactorAuthModule,
  ],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule {}
