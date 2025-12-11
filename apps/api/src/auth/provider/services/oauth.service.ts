import { Injectable } from '@nestjs/common';
import { TRPCError } from '@template/trpc/shared';
import { EncryptJWT, jwtDecrypt } from 'jose';

import { OAuthResponse, Provider, ProviderUserData } from '@/auth/provider/types';
import { TokensService } from '@/auth/tokens';
import { ENCRYPTION_ALG, ROUTS_PATH } from '@/constants';

@Injectable()
export class OAuthService {
  public constructor(
    private readonly options: Provider,
    private readonly baseUrl: string,
    private readonly tokensService: TokensService,
  ) {}

  protected extractUserInfo(data: OAuthResponse): ProviderUserData {
    return {
      id: data.id || '',
      name: data.name || '',
      email: data.email || '',
      picture: data.picture || '',
      access_token: data.access_token || '',
      refresh_token: data.refresh_token || '',
      provider: this.options.name,
    };
  }

  public async getAuthUrl() {
    const verifier = this.tokensService.generateRandomBytes();
    const state = await this.generateState({ verifier });
    const code_challenge = this.tokensService.generateHash(verifier);

    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.options.clientId,
      redirect_uri: this.getRedirectUrl(),
      scope: (this.options.scopes ?? []).join(' '),
      prompt: 'select_account',
      state,
      code_challenge,
      code_challenge_method: ENCRYPTION_ALG.S256,
    });

    return { url: `${this.options.authorizeUrl}?${query}` };
  }

  public async getUserByCode(code: string, code_verifier: string): Promise<ProviderUserData> {
    const client_id = this.options.clientId;
    const client_secret = this.options.clientSecret;

    const tokenQuery = new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri: this.getRedirectUrl(),
      grant_type: 'authorization_code',
      code_verifier,
    });

    const tokenResponseRaw = await fetch(this.options.accessUrl, {
      method: 'POST',
      body: tokenQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    const tokenResponse = (await tokenResponseRaw.json()) as ProviderUserData;

    if (!tokenResponseRaw.ok) {
      throw new TRPCError({ message: 'invalid request token', code: 'BAD_REQUEST' });
    }

    if (!tokenResponse.access_token) {
      throw new TRPCError({ message: 'invalid response token', code: 'BAD_REQUEST' });
    }

    const userRequest = await fetch(this.options.profileUrl, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    });

    if (!userRequest.ok) {
      throw new TRPCError({ message: 'User not found', code: 'UNAUTHORIZED' });
    }

    const user = (await userRequest.json()) as OAuthResponse;
    const userData = this.extractUserInfo(user);

    return {
      ...userData,
      id: user.sub || '',
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: tokenResponse.expires_at,
      provider: this.options.name,
    };
  }

  private async generateState(payload: { verifier: string }) {
    const key = this.tokensService.getSecretKey();

    console.log('state', key);

    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: ENCRYPTION_ALG.DIR, enc: ENCRYPTION_ALG.A256GCM })
      .encrypt(key);
  }

  public async parseState(state: string) {
    const key = this.tokensService.getSecretKey();

    try {
      const { payload } = await jwtDecrypt(state, key);

      return payload as { verifier: string };
    } catch {
      throw new TRPCError({ message: 'Invalid state payload', code: 'UNAUTHORIZED' });
    }
  }

  public getRedirectUrl() {
    return this.baseUrl + ROUTS_PATH.AUTH.PROVIDER_CALLBACK + this.options.name.toLowerCase();
  }

  get name() {
    return this.options.name;
  }
}
