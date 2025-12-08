import { UserResponse, User, Uuid, Jwt } from '@template/contracts';

import { CreateExpressContextOptions } from '@/shared';

export type DataRequest = {
  user: UserResponse;
  tokenId?: string;
};

type ContextServices = {
  userService: {
    getUserById: (userId: Uuid) => Promise<User | null>;
  };
  tokensService: {
    verifyAccessToken: (token: Jwt) => Promise<{ userId: Uuid; tokenId: Uuid }>;
    verifyRefreshToken: (token: Jwt) => Promise<{ userId: Uuid; tokenId: Uuid }>;
  };
};

export type ExtendedTrpcContext = {
  req: CreateExpressContextOptions['req'] & DataRequest;
  services: ContextServices;
} & CreateExpressContextOptions;
