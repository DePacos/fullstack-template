import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
