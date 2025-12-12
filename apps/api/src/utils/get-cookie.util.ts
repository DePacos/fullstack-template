import { Response } from 'express';

import { REFRESH_TOKEN, ROUTS_PATH } from '@/constants';
import { ACCESS_TOKEN } from '@/constants/app.constant';

export const getCookieUtil = {
  ACCESS_COOKIE: (res: Response, cookie: string, cookieTtl: number) => {
    res.cookie(ACCESS_TOKEN, cookie, {
      httpOnly: true,
      secure: true,
      maxAge: cookieTtl,
      sameSite: 'lax',
      path: '/',
    });
  },
  REFRESH_COOKIE: (res: Response, cookie: string, cookieTtl: number) => {
    res.cookie(REFRESH_TOKEN, cookie, {
      httpOnly: true,
      secure: true,
      maxAge: cookieTtl,
      sameSite: 'lax',
      path: '/trpc/' + ROUTS_PATH.AUTH.UPDATE_TOKEN,
    });
  },
};
