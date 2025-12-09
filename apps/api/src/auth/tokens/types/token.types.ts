import { Token, Uuid, Email } from '@template/contracts';

export type SaveTokenData = {
  id: Uuid;
  userId: Uuid;
  email: Email['email'];
  token: string;
  tokenType: Token['type'];
  tokenTtl: number;
};
