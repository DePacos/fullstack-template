import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaService } from '@/prisma';

import { TrpcModule } from '@/trpc/trpc.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, TrpcModule],
  providers: [ConfigService, PrismaService],
})
export class AppModule {}
