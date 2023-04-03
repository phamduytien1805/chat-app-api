import {
  createRedisClientProviders,
  createAsyncProviders,
  redisClientsProvider,
} from './redis.providers';
import {
  DynamicModule,
  FactoryProvider,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { Module } from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';
import { RedisAsyncModuleOptions } from './interfaces/redis.interface';
import { RedisManager } from './redis.manager';

@Module({})
export class RedisModule {
  static forRootAsync(
    options: RedisAsyncModuleOptions,
    isGlobal = true,
  ): DynamicModule {
    if (!options.useFactory) {
      //handle missing configuration options
    }

    const redisClientProviders = createRedisClientProviders();
    const providers: Provider[] = [
      ...createAsyncProviders(options),
      redisClientsProvider,
      RedisManager,
      ...redisClientProviders,
    ];

    return {
      global: isGlobal,
      module: RedisModule,
      imports: options.imports,
      providers,
      exports: [RedisManager, ...redisClientProviders],
    };
  }
}
