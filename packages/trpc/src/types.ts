import { UserResponse } from '@template/contracts';
import { TRPCDefaultErrorShape, TRPCError } from '@trpc/server';

import { CreateExpressContextOptions } from '@/server';

export type ExtendedRouterBuilder = {
  ctx: object;
  meta: object;
  errorShape: ExtendedErrorShape;
  transformer: false;
};

export type ExtendedErrorShape = TRPCDefaultErrorShape & {
  data: TRPCDefaultErrorShape['data'] & {
    message?: string;
    serverHttpStatus?: number;
    exceptionValue?: string;
  };
};

export type ExtendedTRPCError = TRPCError & {
  cause?: {
    status?: number;
    response?: { message?: string; value?: string };
  };
};

export type DataRequest = {
  user: UserResponse;
  tokenId?: string;
};

export type ErrorResponse = {
  error?: {
    message?: string;
    error?: TRPCError['code'];
    statusCode: number;
  };
};

export type ExtendedTrpcContext = {
  res: CreateExpressContextOptions['res'] & ErrorResponse;
  req: CreateExpressContextOptions['req'] & DataRequest;
  info: CreateExpressContextOptions['info'];
} & CreateExpressContextOptions;
