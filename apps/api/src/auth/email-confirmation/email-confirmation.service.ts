import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Uuid,
  Email,
  SendingMailResponse,
  EmailConfirmationRequest,
  ResponseSuccess,
} from '@template/contracts';
import { Response } from 'express';

import { TokensService } from '@/auth/tokens';
import { EMAIL_SUBJECT, ROUTS_PATH } from '@/constants';
import { MailService } from '@/mail';
import { UserService } from '@/user';
import { getCookieUtil } from '@/utils';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async sendLinkEmailConfirmation(
    userId: Uuid,
    email: Email['email'],
    tokenId?: Uuid,
  ): Promise<SendingMailResponse> {
    const BASE_URL = this.configService.getOrThrow<string>('FRONT_APP_URL');

    tokenId && (await this.tokensService.removeToken(tokenId));
    const { verifierToken, verifierTokenId, verifierTtl } = this.tokensService.getVerifyToken();

    await this.tokensService.saveToken({
      id: verifierTokenId,
      userId,
      email,
      token: verifierToken,
      tokenType: 'VERIFICATION',
      tokenTtl: verifierTtl,
    });

    const link = `${BASE_URL + ROUTS_PATH.AUTH.EMAIL_CONFIRMATION}?token=${verifierToken}.${verifierTokenId}`;

    return await this.mailService.sendMailEmailConfirmation(
      email,
      EMAIL_SUBJECT.EMAIL_CONFIRMATION,
      link,
    );
  }

  public async emailConfirmation(
    data: EmailConfirmationRequest,
    res: Response,
  ): Promise<ResponseSuccess> {
    const { foundTokenRow } = await this.tokensService.verifyConfirmationToken(data.token, true);
    const { id, userId } = foundTokenRow;
    await this.userService.verifyUser(userId);
    await this.tokensService.removeToken(id);

    const { refreshToken, refreshTokenId, refreshTtl } =
      await this.tokensService.getRefreshToken(userId);

    const { accessToken, accessTtl } = await this.tokensService.getAccessToken(
      userId,
      refreshTokenId,
    );

    await this.tokensService.saveToken({
      id: refreshTokenId,
      userId: foundTokenRow.userId,
      email: foundTokenRow.email,
      token: refreshToken,
      tokenType: 'REFRESH',
      tokenTtl: refreshTtl,
    });

    getCookieUtil.ACCESS_COOKIE(res, accessToken, accessTtl);
    getCookieUtil.REFRESH_COOKIE(res, refreshToken, refreshTtl);

    return { success: true };
  }

  public async resendLinkEmailConfirmation(
    data: EmailConfirmationRequest,
  ): Promise<SendingMailResponse> {
    const { foundTokenRow } = await this.tokensService.verifyConfirmationToken(data.token);
    return await this.sendLinkEmailConfirmation(
      foundTokenRow.userId,
      foundTokenRow.email,
      foundTokenRow.id,
    );
  }
}
