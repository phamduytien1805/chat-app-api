import { ModuleMetadata, FactoryProvider } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
export type ClientNamespace = string | symbol;
export type RedisClients = Map<ClientNamespace, Redis>;

export interface RedisClientOptions extends RedisOptions {
  /**
   * Client name. If client name is not given then it will be called "default".
   * Different clients must have different names.
   *
   * @defaultValue `"default"`
   */
  namespace?: ClientNamespace;
  onClientCreated?: (client: Redis) => void;
}
export interface RedisModuleOptions {
  connectionOptions?: RedisOptions;
  // onClientReady: (client: Redis) => void;
  config?: RedisClientOptions;
}
export interface RedisAsyncModuleOptions
  extends Pick<ModuleMetadata, 'imports'>,
    Pick<FactoryProvider, 'inject'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
