import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthProvider } from '@prisma/__generated__/enums';
import { TRPCError } from '@template/trpc/shared';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { ProviderService } from '@/auth/provider/provider.service';

@Injectable()
export class AuthProviderGuard implements CanActivate {
  public constructor(private readonly providerService: ProviderService) {}

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const provider = request.params.provider as AuthProvider;

    const providerInstance = this.providerService.findByService(provider);

    if (!providerInstance)
      throw new TRPCError({ message: 'Provider not found', code: 'NOT_FOUND' });

    return true;
  }
}
