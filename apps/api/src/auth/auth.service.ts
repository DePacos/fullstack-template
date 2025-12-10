import { Injectable } from '@nestjs/common';
import {
  Uuid,
  User,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SendingMailResponse,
} from '@template/contracts';
import { TRPCError } from '@template/trpc/shared';
import * as argon2 from 'argon2';
import { Response } from 'express';

import { EmailConfirmationService } from '@/auth/email-confirmation';
import { TokensService } from '@/auth/tokens';
import { TwoFactorAuthService } from '@/auth/two-factor-auth';
import { UserService } from '@/user';
import { getCookieUtil } from '@/utils';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly tokensService: TokensService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  public async register(data: SignUpRequest): Promise<SendingMailResponse> {
    const { name, email, password } = data;
    const user = await this.userService.getUserByEmail(email);
    if (user) throw new TRPCError({ message: 'Email exists', code: 'CONFLICT' });

    const passwordHash = await argon2.hash(password);
    const newUser = await this.userService.createUser({ name, email, password: passwordHash });

    return await this.emailConfirmationService.sendLinkEmailConfirmation(newUser.id, newUser.email);
  }

  public async login(data: SignInRequest, res: Response): Promise<SignInResponse> {
    const { email, password } = data;
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new TRPCError({ message: 'User not exists', code: 'NOT_FOUND' });
    if (user.password && !(await argon2.verify(user.password, password)))
      throw new TRPCError({ message: 'Invalid email or password', code: 'CONFLICT' });

    if (!user.isVerified) {
      await this.emailConfirmationService.sendLinkEmailConfirmation(user.id, user.email);
      throw new TRPCError({
        message: 'Your mail has not been confirmed, and a link has been sent to confirm your mail.',
        code: 'CONFLICT',
      });
    }

    if (user.isTwoFactorEnable) {
      return await this.twoFactorAuthService.sendMailTwoFactorAuth(user.id, user.email);
    }

    await this.getAuthTokens(user, res);

    return { auth: 'auth' };
  }

  public async logout(tokenId: Uuid, res: Response) {
    await this.tokensService.removeToken(tokenId);
    getCookieUtil.ACCESS_COOKIE(res, '', 0);
    getCookieUtil.REFRESH_COOKIE(res, '', 0);
  }

  public async update(userId: Uuid, tokenId: Uuid, res: Response): Promise<void> {
    const { accessToken, accessTtl } = await this.tokensService.getAccessToken(userId, tokenId);
    getCookieUtil.ACCESS_COOKIE(res, accessToken, accessTtl);
  }

  public async getAuthTokens(user: User, res: Response) {
    const foundTokenRow = await this.tokensService.getTokenByUserIdTokenType(user.id, 'REFRESH');
    if (foundTokenRow) await this.tokensService.removeToken(foundTokenRow.id);

    const { refreshToken, refreshTokenId, refreshTtl } = await this.tokensService.getRefreshToken(
      user.id,
    );

    const { accessToken, accessTtl } = await this.tokensService.getAccessToken(
      user.id,
      refreshTokenId,
    );

    await this.tokensService.saveToken({
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
