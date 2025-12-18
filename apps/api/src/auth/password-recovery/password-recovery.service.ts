import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Token,
  PasswordRecoveryRequestEmail,
  PasswordRecoveryRequestPassword,
  SendingMailResponse,
  ResponseSuccess,
} from '@template/contracts';
import { TRPCError } from '@template/trpc/shared';

import { TokensService } from '@/auth/tokens';
import { EMAIL_SUBJECT, ROUTS_PATH } from '@/constants';
import { MailService } from '@/mail';
import { UserService } from '@/user';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokensService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async sendPasswordRecoveryLink(
    data: PasswordRecoveryRequestEmail,
  ): Promise<SendingMailResponse> {
    const user = await this.userService.getUserByEmail(data.email);
    if (!user) throw new TRPCError({ message: 'User not exists', code: 'NOT_FOUND' });

    const BASE_URL = this.configService.getOrThrow<string>('FRONT_APP_URL');

    const foundTokenRow = await this.tokenService.getTokenByUserIdTokenType(
      user.id,
      'PASSWORD_RESET',
    );
    if (foundTokenRow) await this.tokenService.removeToken(foundTokenRow.id);

    const { verifierToken, verifierTokenId, verifierTtl } = this.tokenService.getVerifyToken();

    await this.tokenService.saveToken({
      id: verifierTokenId,
      userId: user.id,
      email: user.email,
      token: verifierToken,
      tokenType: 'PASSWORD_RESET',
      tokenTtl: verifierTtl,
    });

    const link = `${BASE_URL + ROUTS_PATH.AUTH.PASSWORD_RECOVERY}?token=${verifierToken}.${verifierTokenId}`;

    return await this.mailService.sendMailPasswordRecovery(
      user.email,
      EMAIL_SUBJECT.PASSWORD_RECOVERY,
      link,
    );
  }

  public async passwordRecovery(data: PasswordRecoveryRequestPassword): Promise<ResponseSuccess> {
    const { foundTokenRow } = await this.tokenService.verifyConfirmationToken(data.token, true);

    await this.tokenService.removeToken(foundTokenRow.id);
    await this.userService.changePassword(foundTokenRow.userId, data.password);

    return { success: true };
  }

  public async resentPasswordRecoveryLink(token: Token['token']): Promise<SendingMailResponse> {
    const { foundTokenRow } = await this.tokenService.verifyConfirmationToken(token);

    return await this.sendPasswordRecoveryLink({ email: foundTokenRow.email });
  }
}
