import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@template/contracts';
import { Response } from 'express';

import { ProviderService } from '@/auth/provider';
import { PARAM, ROUTS_PATH } from '@/constants';
import { AuthProviderGuard } from '@/guards/auth-provider.guard';

@Controller()
export class ProviderController {
  constructor(
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
  ) {}

  @UseGuards(AuthProviderGuard)
  @Get(ROUTS_PATH.AUTH.PROVIDER_CONNECT_PARAM)
  connect(@Param(PARAM.PROVIDER) provider: AuthProvider) {
    return this.providerService.generateServiceUrl(provider);
  }

  @UseGuards(AuthProviderGuard)
  @Get(ROUTS_PATH.AUTH.PROVIDER_CALLBACK_PARAM)
  async callback(
    @Param(PARAM.PROVIDER) provider: AuthProvider,
    @Res() res: Response,
    @Query(PARAM.CODE) code?: string,
    @Query(PARAM.STATE) state?: string,
  ) {
    await this.providerService.serviceAuthentication(provider, res, code, state);
    const redirectUrl = this.configService.getOrThrow<string>('FRONT_APP_URL');

    return res.redirect(redirectUrl);
  }
}
