import { Module } from '@nestjs/common';

import { UserModule, UserTrpcService } from '@/user';

import { AuthModule } from '@/auth/auth.module';

import { TrpcService } from './trpc.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [TrpcService, UserTrpcService],
  exports: [TrpcService],
})
export class TrpcModule {}
