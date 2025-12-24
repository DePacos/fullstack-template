import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TokensModule } from '@/auth/tokens';
import { PrismaModule } from '@/prisma';
import { UserModule } from '@/user';

import { AuthModule } from '@/auth/auth.module';
import { MailModule } from '@/mail/mail.module';
import { TrpcModule } from '@/trpc/trpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MailModule,
    TrpcModule,
    PrismaModule,
    TokensModule,
    UserModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
