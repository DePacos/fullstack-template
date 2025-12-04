import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TokensModule } from '@/auth/tokens';
import { PrismaService } from '@/prisma';
import { UserModule } from '@/user';

import { MailModule } from '@/mail/mail.module';
import { TrpcModule } from '@/trpc/trpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    TrpcModule,
    TokensModule,
    UserModule,
  ],
  providers: [ConfigService, PrismaService],
})
export class AppModule {}
