import { Injectable } from '@nestjs/common';
import { createUserRouter, UserRouter } from '@template/trpc/client';

import { UserService } from '@/user';

@Injectable()
export class UserTrpcService {
  public readonly router: UserRouter;

  constructor(private readonly userService: UserService) {
    this.router = createUserRouter(this.userService);
  }
}
