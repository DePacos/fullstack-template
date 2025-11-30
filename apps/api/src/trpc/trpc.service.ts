import { Injectable } from '@nestjs/common';
import { AppRouter, createAppRouter } from '@template/trpc/client';

import { UserTrpcService } from '@/user';

@Injectable()
export class TrpcService {
  public readonly appRouter: AppRouter;

  constructor(private readonly userTrpcService: UserTrpcService) {
    this.appRouter = createAppRouter({
      user: this.userTrpcService.router,
    });
  }
}
