import type { UserResponse, Uuid } from '@template/contracts';

import 'express';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: Uuid;
  }
}

declare module 'express' {
  interface Request {
    user: UserResponse;
    tokenId?: Uuid;
  }
}
