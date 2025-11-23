import { initTRPC, TRPCError } from '@trpc/server';
import { RouterBuilder } from '@trpc/server/unstable-core-do-not-import';

import { ExtendedTrpcContext, ExtendedRouterBuilder } from '../types';
import { errorFormatter } from './configTrpc';

const t = initTRPC.context<ExtendedTrpcContext>().create({
  errorFormatter,
});

const errorProcedure = t.middleware(({ ctx, next }) => {
  if (ctx.res?.error) {
    const { message, error, statusCode } = ctx.res.error;
    const err = error.toUpperCase() as TRPCError['code'];

    throw new TRPCError({ message, code: err, cause: statusCode });
  }
  return next();
});

export const router: RouterBuilder<ExtendedRouterBuilder> = t.router;
export const procedure = t.procedure.use(errorProcedure);
