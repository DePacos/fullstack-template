import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { createContext } from '@template/trpc/client';
import { createExpressMiddleware } from '@template/trpc/server';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { getCorsConfig, getSessionConfig } from '@/configs';
import { TrpcService } from '@/trpc';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { appRouter } = app.get(TrpcService);

  app.use(cookieParser(configService.getOrThrow<string>('COOKIES_SECRET')));
  app.enableCors(getCorsConfig(configService));
  app.use('/trpc', createExpressMiddleware({ router: appRouter, createContext }));
  app.use(session(await getSessionConfig(configService)));

  await app.listen(configService.getOrThrow<number>('BACK_APPLICATION_PORT'));
}

bootstrap();
