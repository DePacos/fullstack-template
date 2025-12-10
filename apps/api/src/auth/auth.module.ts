import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createAuthRouter } from '@template/trpc/server';

import { AuthService } from '@/auth';
import { EmailConfirmationModule } from '@/auth/email-confirmation';
import { PasswordRecoveryModule } from '@/auth/password-recovery';
import { ProviderModule } from '@/auth/provider';
import { TokensModule, TokensService } from '@/auth/tokens';
import { TwoFactorAuthModule } from '@/auth/two-factor-auth';
import { getProviderConfig } from '@/configs';
import { UserModule } from '@/user';

export const AUTH_ROUTER = Symbol('AUTH_ROUTER');

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule, UserModule, TokensModule],
      useFactory: getProviderConfig,
      inject: [ConfigService, TokensService],
    }),
    // GoogleRecaptchaModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: getRecaptchaConfig,
    //   inject: [ConfigService],
    // }),
    // GoogleRecaptchaModule,
    UserModule,
    EmailConfirmationModule,
    TokensModule,
    PasswordRecoveryModule,
    TwoFactorAuthModule,
  ],
  providers: [
    AuthService,
    {
      provide: AUTH_ROUTER,
      useFactory: (service: AuthService) => createAuthRouter(service),
      inject: [AuthService],
    },
  ],
  exports: [AuthService, AUTH_ROUTER],
})
export class AuthModule {}
