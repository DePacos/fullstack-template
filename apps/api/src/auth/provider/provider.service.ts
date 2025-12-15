import { Inject } from '@nestjs/common';
import { AuthProvider } from '@template/contracts';
import { TRPCError } from '@template/trpc/shared';
import { Response } from 'express';

import { Options, OAUTH_PROVIDER } from '@/auth/provider/types';
import { TokensService } from '@/auth/tokens';
import { UserService } from '@/user';
import { getCookieUtil } from '@/utils';

export class ProviderService {
  public constructor(
    @Inject(OAUTH_PROVIDER)
    private readonly options: Options,
    private readonly userService: UserService,
    private readonly tokenService: TokensService,
  ) {}

  public findByService(service: AuthProvider) {
    const providerInstance =
      this.options.services.find((s) => s.name === service.toUpperCase()) ?? null;

    if (!providerInstance)
      throw new TRPCError({ message: 'Provider service not found', code: 'NOT_FOUND' });

    return providerInstance;
  }

  public async generateServiceUrl(service: AuthProvider) {
    const providerInstance = this.findByService(service);

    return await providerInstance.getAuthUrl();
  }

  public async serviceAuthentication(
    service: AuthProvider,
    res: Response,
    code?: string,
    state?: string,
  ) {
    if (!code || !state)
      throw new TRPCError({ message: 'Invalid url authorization', code: 'BAD_REQUEST' });

    const providerInstance = this.findByService(service);
    const { verifier } = await providerInstance.parseState(state);
    const providerProfile = await providerInstance?.getUserByCode(code, verifier);

    const foundUser = await this.userService.getUserByEmail(providerProfile.email);
    const account = foundUser?.account.find((acc) => acc.provider === providerInstance.name);

    if (foundUser && !account)
      await this.userService.createAccountByProvider(foundUser.id, providerInstance.name);

    const user = foundUser
      ? foundUser
      : await this.userService.createUserByProvider(providerProfile);

    const foundTokenRow = await this.tokenService.getTokenByUserIdTokenType(user.id, 'REFRESH');
    if (foundTokenRow) await this.tokenService.removeToken(foundTokenRow.id);

    const { refreshToken, refreshTokenId, refreshTtl } = await this.tokenService.getRefreshToken(
      user.id,
    );
    const { accessToken, accessTtl } = await this.tokenService.getAccessToken(
      user.id,
      refreshTokenId,
    );

    await this.tokenService.saveToken({
      id: refreshTokenId,
      userId: user.id,
      email: user.email,
      token: refreshToken,
      tokenType: 'REFRESH',
      tokenTtl: refreshTtl,
    });

    getCookieUtil.ACCESS_COOKIE(res, accessToken, accessTtl);
    getCookieUtil.REFRESH_COOKIE(res, refreshToken, refreshTtl);
  }
}
