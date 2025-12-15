import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { AuthProvider } from '@template/contracts';

import { OAuthService } from '@/auth/provider';

export const OAUTH_PROVIDER = Symbol();

export type Provider = {
  name: AuthProvider;
  authorizeUrl: string;
  accessUrl: string;
  profileUrl: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
};

export type ProviderOptions = {
  scopes: string[];
  client_id: string;
  client_secret: string;
};

export type Options = {
  services: OAuthService[];
};

export type AsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<Options>, 'useFactory' | 'inject'>;

export type ProviderUserData = {
  id: string;
  name: string;
  email: string;
  picture: string;
  access_token?: string | null;
  refresh_token?: string;
  expires_at?: number;
  provider: AuthProvider;
};

export type OAuthResponse = {
  sub?: string;
  id?: string;
  email: string;
  email_verified?: boolean;
  default_email?: string;
  emails?: string[];
  name: string;
  given_name?: string;
  family_name?: string;
  first_name?: string;
  last_name?: string;
  login?: string;
  picture?: string;
  default_avatar_id?: string;
  birthday?: string;
  display_name?: string;
  sex?: 'male' | 'female' | null;
  default_phone?: { id: number; number: string };
  access_token?: string;
  refresh_token?: string;
};
