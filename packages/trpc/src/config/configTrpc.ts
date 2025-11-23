import { ExtendedTrpcContext, ExtendedTRPCError, ExtendedErrorShape } from '@/types';

export const createContext = (ctxOptions: ExtendedTrpcContext) => ctxOptions;

export const errorFormatter = ({ shape, error }): ExtendedErrorShape => {
  const err = error as ExtendedTRPCError;

  return {
    ...shape,
    data: {
      message: err.cause?.response?.message,
      code: shape.data.code,
      httpStatus: shape.data.httpStatus,
      serverHttpStatus: err.cause?.status,
      exceptionValue: err.cause?.response?.value,
    },
  };
};
