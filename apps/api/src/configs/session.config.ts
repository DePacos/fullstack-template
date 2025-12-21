import { ConfigService } from '@nestjs/config';
import { SessionOptions } from 'express-session';

// import { getRedisConfig } from '@/configs/redis.config';
import { parseBooleanUtil, ms, type StringValue } from '@/utils';

export const getSessionConfig = async (configService: ConfigService): Promise<SessionOptions> => ({
  secret: configService.getOrThrow<string>('SESSION_SECRET'),
  name: configService.getOrThrow<string>('SESSION_NAME'),
  resave: true,
  saveUninitialized: false,
  cookie: {
    domain: configService.getOrThrow<string>('SESSION_DOMAIN'),
    maxAge: ms(configService.getOrThrow<StringValue>('SESSION_MAX_AGE')),
    httpOnly: parseBooleanUtil(configService.getOrThrow<string>('SESSION_HTTP_ONLY')),
    secure: parseBooleanUtil(configService.getOrThrow<string>('SESSION_SECURE')),
    sameSite: 'lax',
  },
  // store: await getRedisConfig(configService),
});
