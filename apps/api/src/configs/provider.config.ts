import { ConfigService } from '@nestjs/config';

import { GoogleService } from '@/auth/provider/services/google.service';
import { YandexService } from '@/auth/provider/services/yandex.service';
import { Options } from '@/auth/provider/types';
import { TokensService } from '@/auth/tokens';

export const getProviderConfig = async (
  configService: ConfigService,
  tokensService: TokensService,
): Promise<Options> => ({
  services: [
    new GoogleService(
      {
        client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
        client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile'],
      },
      configService.getOrThrow<string>('BACK_APP_URL'),
      tokensService,
    ),
    new YandexService(
      {
        client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
        client_secret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
        scopes: ['login:email', 'login:avatar', 'login:info'],
      },
      configService.getOrThrow<string>('BACK_APP_URL'),
      tokensService,
    ),
  ],
});
