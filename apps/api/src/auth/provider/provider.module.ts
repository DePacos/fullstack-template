import { DynamicModule, Module } from '@nestjs/common';

import { ProviderController, ProviderService } from '@/auth/provider';
import { type AsyncOptions, OAUTH_PROVIDER, type Options } from '@/auth/provider/types';

@Module({})
export class ProviderModule {
  public static register(options: Options): DynamicModule {
    return {
      module: ProviderModule,
      providers: [
        {
          useValue: options.services,
          provide: OAUTH_PROVIDER,
        },
        ProviderService,
      ],
      controllers: [ProviderController],
      exports: [ProviderService],
    };
  }

  public static registerAsync(options: AsyncOptions): DynamicModule {
    return {
      imports: options.imports,
      module: ProviderModule,
      providers: [
        {
          useFactory: options.useFactory,
          provide: OAUTH_PROVIDER,
          inject: options.inject,
        },
        ProviderService,
      ],
      controllers: [ProviderController],
      exports: [ProviderService],
    };
  }
}
