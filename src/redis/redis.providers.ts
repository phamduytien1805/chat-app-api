import { Provider, FactoryProvider, ValueProvider } from '@nestjs/common';
import Redis from 'ioredis';
import {
  ClientNamespace,
  RedisModuleOptions,
  RedisAsyncModuleOptions,
} from './interfaces/redis.interface';
import { RedisManager } from './redis.manager';
import {
  REDIS_OPTIONS,
  REDIS_CLIENTS,
  DEFAULT_REDIS_NAMESPACE,
} from './constants/redis.constants';
import { RedisClients } from './interfaces/redis.interface';

export const namespaces = new Map<ClientNamespace, ClientNamespace>();

export const createRedisClientProviders = (): FactoryProvider<Redis>[] => {
  const providers: FactoryProvider<Redis>[] = [];
  namespaces.forEach((token, namespace) => {
    providers.push({
      provide: token,
      useFactory: (redisManager: RedisManager) =>
        redisManager.getClient(namespace),
      inject: [RedisManager],
    });
  });
  return providers;
};

export const createAsyncOptionsProvider = (
  options: RedisAsyncModuleOptions,
): Provider => {
  if (options.useFactory) {
    return {
      provide: REDIS_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }
  return {
    provide: REDIS_OPTIONS,
    useValue: {},
  };
};

export const createAsyncProviders = (
  options: RedisAsyncModuleOptions,
): Provider[] => {
  if (options.useFactory) return [createAsyncOptionsProvider(options)];

  return [];
};

export const redisClientsProvider: FactoryProvider<RedisClients> = {
  provide: REDIS_CLIENTS,
  useFactory: (options: RedisModuleOptions) => {
    const clients: RedisClients = new Map();
    if (options.config) {
      const { namespace, onClientCreated, ...redisOptions } = options.config;
      let client: Redis = new Redis(redisOptions);
      if (onClientCreated) {
        onClientCreated(client);
      }

      clients.set(namespace ?? DEFAULT_REDIS_NAMESPACE, client);
    }
    return clients;
  },
};
