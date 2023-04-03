import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ClientNamespace, RedisClients } from './interfaces/redis.interface';
import {
  REDIS_CLIENTS,
  DEFAULT_REDIS_NAMESPACE,
} from './constants/redis.constants';

/**
 * Manager for redis clients.
 *
 * @public
 */
@Injectable()
export class RedisManager {
  constructor(
    @Inject(REDIS_CLIENTS) private readonly redisClients: RedisClients,
  ) {}

  get clients(): ReadonlyMap<ClientNamespace, Redis> {
    return this.redisClients;
  }

  getClient(namespace: ClientNamespace = DEFAULT_REDIS_NAMESPACE): Redis {
    const client = this.redisClients.get(namespace);
    if (!client) {
      //HANDLE ERROR
      throw new Error();
    }
    return client;
  }
}
