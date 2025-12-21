import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { createExpressMiddleware } from '@template/trpc/shared';
import cookieParser from 'cookie-parser';

import { getCorsConfig } from '@/configs';
import { TrpcService } from '@/trpc';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { appRouter, createContext } = app.get(TrpcService);

  app.use(cookieParser(configService.getOrThrow<string>('COOKIES_SECRET')));
  app.enableCors(getCorsConfig(configService));
  app.use('/trpc', createExpressMiddleware({ router: appRouter, createContext }));

  await app.listen(configService.getOrThrow<number>('BACK_APP_PORT'));
}

bootstrap();
