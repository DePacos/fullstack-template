import {
  Me,
  MeResponseSchema,
  SendingMailResponse,
  SendingMailResponseSchema,
  SignInRequest,
  SignInRequestSchema,
  SignInResponse,
  SignInResponseSchema,
  SignUpRequest,
  SignUpRequestSchema,
  TokenId,
  User,
} from '@template/contracts';
import { z } from 'zod';

import { procedure, router } from '@/config';
import { CreateExpressContextOptions } from '@/server';
import { UserRequest } from '@/types';

type Response = CreateExpressContextOptions['res'];

export type AuthService = {
  register(data: SignUpRequest): Promise<SendingMailResponse>;
  login(data: SignInRequest, res: Response): Promise<SignInResponse | void>;
  logout(tokenId, res: Response): Promise<void>;
  me(user: UserRequest): Promise<Me>;
  update(userId: User['id'], tokenId: TokenId['tokenId'], res: Response): Promise<void>;
};

export const createAuthRouter = (authService: AuthService) =>
  router({
    register: procedure
      .input(SignUpRequestSchema)
      .output(SendingMailResponseSchema)
      .mutation(({ input }) => authService.register(input)),
    login: procedure
      .input(SignInRequestSchema)
      .output(z.union([SignInResponseSchema, z.void()]))
      .mutation(({ ctx, input }) => authService.login(input, ctx.res)),
    logout: procedure.mutation(({ ctx }) => authService.logout(ctx.req.tokenId, ctx.res)),
    me: procedure.output(MeResponseSchema).query(({ ctx }) => {
      return authService.me(ctx.req.user);
    }),
    update: procedure.mutation(({ ctx }) => {
      return authService.update(ctx.req.user.id, ctx.req.tokenId, ctx.res);
    }),
  });
export type AuthRouter = ReturnType<typeof createAuthRouter>;
