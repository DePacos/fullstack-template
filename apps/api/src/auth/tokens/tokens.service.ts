import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Uuid, TokenType, Jwt } from '@template/contracts';
import * as argon2 from 'argon2';
import { jwtVerify, SignJWT } from 'jose';
import { createHash, createSecretKey, randomBytes, randomUUID } from 'node:crypto';

import { SaveTokenData } from '@/auth/tokens/types';
import { ENCRYPTION_ALG } from '@/constants';
import { PrismaService } from '@/prisma/prisma.service';
import { StringValue, ms } from '@/utils';

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  public getSecretKey(encoding = ENCRYPTION_ALG.BASE64URL) {
    const authStateSecret = this.configService.getOrThrow<string>('TOKEN_SECRET');
    return createSecretKey(authStateSecret, encoding);
  }

  public generateRandomBytes(
    length = ENCRYPTION_ALG.LENGTH64,
    encoding = ENCRYPTION_ALG.BASE64URL,
  ) {
    return randomBytes(length).toString(encoding);
  }

  public generateHash(
    value: string,
    alg = ENCRYPTION_ALG.SHA256,
    encoding = ENCRYPTION_ALG.BASE64URL,
  ) {
    return createHash(alg).update(value).digest().toString(encoding);
  }

  public async getTokenById(tokenId: Uuid) {
    return this.prismaService.token.findUnique({ where: { id: tokenId } });
  }

  public async getTokenByUserIdTokenType(userId: Uuid, tokenType: TokenType) {
    return this.prismaService.token.findUnique({
      where: { user_type_unique: { userId, type: tokenType } },
    });
  }

  public async getAccessToken(userId: Uuid, refreshId: Uuid) {
    const key = this.getSecretKey();
    const accessTtl = this.configService.getOrThrow<StringValue>('TOKEN_ACCESS_TTL');

    const accessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: ENCRYPTION_ALG.HS256 })
      .setJti(refreshId)
      .setIssuedAt()
      .setExpirationTime(accessTtl)
      .sign(key);

    return { accessToken, accessTtl: ms(accessTtl) };
  }

  public async getRefreshToken(userId: Uuid) {
    const key = this.getSecretKey();
    const refreshTokenId = randomUUID();
    const refreshTtl = this.configService.getOrThrow<StringValue>('TOKEN_REFRESH_TTL');

    const refreshToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: ENCRYPTION_ALG.HS256 })
      .setJti(refreshTokenId)
      .setIssuedAt()
      .setExpirationTime(refreshTtl)
      .sign(key);

    return { refreshToken, refreshTokenId, refreshTtl: ms(refreshTtl) };
  }

  public getVerifyToken() {
    const verifierToken = this.generateRandomBytes();
    const verifierTokenId = randomUUID();
    const verifierTtl = ms(this.configService.getOrThrow<StringValue>('TOKEN_VERIFY_TTL'));

    return { verifierTokenId, verifierToken, verifierTtl };
  }

  public getTwoFactorToken() {
    const twoFactorTokenId = randomUUID();
    const twoFactorToken = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString();
    const twoFactorTtl = ms(this.configService.getOrThrow<StringValue>('TOKEN_TWO_FACTOR_TTL'));

    return { twoFactorTokenId, twoFactorToken, twoFactorTtl };
  }

  public async verifyAccessToken(token: Jwt) {
    const key = this.getSecretKey();

    try {
      const { payload } = await jwtVerify(token, key, { clockTolerance: '5s' });
      if (!payload?.userId || !payload?.jti)
        throw new UnauthorizedException('Token payload invalid');

      return { userId: payload.userId as string, refreshTokenId: payload.jti };
    } catch {
      throw new UnauthorizedException('AccessToken invalid');
    }
  }

  public async verifyRefreshToken(token: Jwt) {
    const key = this.getSecretKey();

    try {
      const { payload } = await jwtVerify(token, key, { clockTolerance: '5s' });
      if (!payload?.userId || !payload?.jti)
        throw new UnauthorizedException('Token payload invalid');

      return this.verifyToken(token, payload.jti);
    } catch {
      throw new UnauthorizedException('RefreshToken invalid');
    }
  }

  public async verifyConfirmationToken(token: string, isExpires?: boolean) {
    const [tokenData, tokenId] = token.split('.');
    if (!tokenData || !tokenId) throw new BadRequestException('Token invalid');

    return await this.verifyToken(tokenData, tokenId, isExpires);
  }

  public async verifyToken(token: string, tokenId: Uuid, isExpires?: boolean) {
    const foundTokenRow = await this.getTokenById(tokenId);

    //todo make multiple input attempts

    if (!foundTokenRow) {
      throw new ConflictException('Token not found');
    }

    if (!(await argon2.verify(foundTokenRow.token, token))) {
      throw new ConflictException('Token not verified');
    }
    if (isExpires && foundTokenRow.expiresAt < new Date()) {
      throw new ConflictException({ message: 'Token expired', value: foundTokenRow.email });
    }

    return { foundTokenRow };
  }

  public async saveToken(data: SaveTokenData) {
    const { id, userId, email, token, tokenType: type, tokenTtl } = data;
    const tokenHash = await argon2.hash(token);
    const expiresAt = new Date(tokenTtl + Date.now());

    return this.prismaService.token.create({
      data: {
        id,
        userId,
        email,
        token: tokenHash,
        type,
        expiresAt,
      },
    });
  }

  public async removeToken(tokenId: Uuid) {
    const token = await this.prismaService.token.findUnique({
      where: { id: tokenId },
    });
    if (!token) throw new NotFoundException('Token not found');

    await this.prismaService.token.delete({ where: { id: tokenId } });
  }
}
