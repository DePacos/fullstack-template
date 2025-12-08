import { TRPCDefaultErrorShape, TRPCError } from '@trpc/server';

export const errorFormatter = ({
  shape,
  error,
}: {
  shape: TRPCDefaultErrorShape;
  error: TRPCError;
}): any => {
  return {
    ...shape,
    data: {
      code: shape.data.code,
      httpStatus: shape.data.httpStatus,
      cause: error?.cause?.message || null,
    },
  };
};
