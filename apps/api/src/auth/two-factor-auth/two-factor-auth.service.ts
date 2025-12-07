import { Injectable, NotFoundException } from '@nestjs/common';
import { Uuid, Email, SignInResponse, TwoFactorAuthRequest } from '@template/contracts';
import { Response } from 'express';

import { TokensService } from '@/auth/tokens';
import { EMAIL_SUBJECT } from '@/constants';
import { MailService } from '@/mail';
import { getCookieUtil } from '@/utils';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly mailService: MailService,
  ) {}

  public async sendMailTwoFactorAuth(userId: Uuid, email: Email['email']): Promise<SignInResponse> {
    const foundTwoFactorTokenRow = await this.tokensService.getTokenByUserIdTokenType(
      userId,
      'TWO_FACTOR',
    );

    if (foundTwoFactorTokenRow) await this.tokensService.removeToken(foundTwoFactorTokenRow.id);

    const { twoFactorTokenId, twoFactorToken, twoFactorTtl } =
      this.tokensService.getTwoFactorToken();

    await this.tokensService.saveToken({
      id: twoFactorTokenId,
      userId,
      email,
      token: twoFactorToken,
      tokenType: 'TWO_FACTOR',
      tokenTtl: twoFactorTtl,
    });

    const { sentMail } = await this.mailService.sendMailTwoFactorAuth(
      email,
      EMAIL_SUBJECT.TWO_FACTOR_AUTH,
      twoFactorToken,
    );

    return sentMail
      ? { auth: '2fa', sentMail, twoFactorTokenId, expiresAt: twoFactorTtl + Date.now() }
      : { auth: '2fa', sentMail };
  }

  public async twoFactorAuth(data: TwoFactorAuthRequest, res: Response) {
    const { code, tokenId } = data;

    const { foundTokenRow } = await this.tokensService.verifyToken(code, tokenId, true);
    await this.tokensService.removeToken(foundTokenRow.id);

    const foundRefreshTokenRow = await this.tokensService.getTokenByUserIdTokenType(
      foundTokenRow.userId,
      'REFRESH',
    );
    if (foundRefreshTokenRow) await this.tokensService.removeToken(foundRefreshTokenRow.id);

    const { refreshToken, refreshTokenId, refreshTtl } = await this.tokensService.getRefreshToken(
      foundTokenRow.userId,
    );

    const { accessToken, accessTtl } = await this.tokensService.getAccessToken(
      foundTokenRow.userId,
      refreshTokenId,
    );

    await this.tokensService.saveToken({
      id: refreshTokenId,
      userId: foundTokenRow.userId,
      email: foundTokenRow.email,
      token: refreshToken,
      tokenType: 'TWO_FACTOR',
      tokenTtl: refreshTtl,
    });

    getCookieUtil.ACCESS_COOKIE(res, accessToken, accessTtl);
    getCookieUtil.REFRESH_COOKIE(res, refreshToken, refreshTtl);
  }

  public async resendMailTwoFactorAuth(tokenId: Uuid) {
    const foundTokenRow = await this.tokensService.getTokenById(tokenId);
    if (!foundTokenRow) throw new NotFoundException('Token not found');
    await this.tokensService.removeToken(tokenId);

    return this.sendMailTwoFactorAuth(foundTokenRow.userId, foundTokenRow.email);
  }
}
