import { UserResponseSchema } from '@template/contracts';
import { initTRPC, TRPCError } from '@trpc/server';

import { superjson } from '@/shared';

import { ExtendedTrpcContext } from '../types';
import { errorFormatter } from './configTrpc';

const t = initTRPC.context<ExtendedTrpcContext>().create({
  transformer: superjson,
  errorFormatter,
});

const protect = t.middleware(async ({ path, ctx, next }) => {
  const isUpdate = path === 'auth.update';

  try {
    const token: string | undefined = isUpdate
      ? ctx.req.cookies?.refreshToken
      : ctx.req.cookies?.accessToken;

    if (!token) throw new TRPCError({ message: 'Token invalid', code: 'UNAUTHORIZED' });
    const { userId, tokenId } = isUpdate
      ? await ctx.services.tokensService.verifyRefreshToken(token)
      : await ctx.services.tokensService.verifyAccessToken(token);

    const user = await ctx.services.userService.getUserById(userId);
    if (!user) throw new TRPCError({ message: 'User not found', code: 'NOT_FOUND' });

    ctx.req.user = UserResponseSchema.strip().parse(user);
    ctx.req.tokenId = tokenId;
  } catch (error) {
    const err = error as TRPCError;
    throw new TRPCError({ message: err.message, code: err.code, cause: err.cause });
  }

  return next();
});

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = procedure.use(protect);

export { superjson };
