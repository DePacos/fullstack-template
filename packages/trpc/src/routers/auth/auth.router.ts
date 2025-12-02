import {
  SendingMailResponse,
  SendingMailResponseSchema,
  SignInRequest,
  SignInRequestSchema,
  SignInResponse,
  SignInResponseSchema,
  SignUpRequest,
  SignUpRequestSchema,
  Uuid,
} from '@template/contracts';

import { procedure, router } from '@/config';
import { CreateExpressContextOptions } from '@/server';

type Response = CreateExpressContextOptions['res'];

export type AuthService = {
  register(data: SignUpRequest): Promise<SendingMailResponse>;
  login(data: SignInRequest, res: Response): Promise<SignInResponse>;
  logout(tokenId, res: Response): Promise<void>;
  update(userId: Uuid, tokenId: Uuid, res: Response): Promise<void>;
};

export const createAuthRouter = (authService: AuthService) =>
  router({
    register: procedure
      .input(SignUpRequestSchema)
      .output(SendingMailResponseSchema)
      .mutation(({ input }) => authService.register(input)),
    login: procedure
      .input(SignInRequestSchema)
      .output(SignInResponseSchema)
      .mutation(({ ctx, input }) => authService.login(input, ctx.res)),
    logout: procedure.mutation(({ ctx }) => authService.logout(ctx.req.tokenId, ctx.res)),
    me: procedure.query(({ ctx }) => {
      return ctx.req.user;
    }),
    update: procedure.mutation(({ ctx }) => {
      return authService.update(ctx.req.user.id, ctx.req.tokenId, ctx.res);
    }),
  });
export type AuthRouter = ReturnType<typeof createAuthRouter>;
