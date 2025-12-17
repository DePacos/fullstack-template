import { Module } from '@nestjs/common';
import { createUserRouter } from '@template/trpc/server';

import { PrismaModule } from '@/prisma';
import { UserService } from '@/user/user.service';
export const USER_ROUTER = Symbol();

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    {
      provide: USER_ROUTER,
      useFactory: (service: UserService) => createUserRouter(service),
      inject: [UserService],
    },
  ],
  exports: [UserService, USER_ROUTER],
})
export class UserModule {}
