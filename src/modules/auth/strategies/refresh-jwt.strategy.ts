import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenType } from '../../../constants';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { Request } from 'express';
import { InvalidateRefreshToken } from '../../../exceptions/invalidate-refresh-token.exception';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { format } from 'util';
import { PREFIX_REFRESH_TOKEN } from '../../../constants/redis-patterns';
import { UserService } from '../../user/user.service';

@Injectable()
export class RefreshTokenJWTStrategy extends PassportStrategy(
  Strategy,
  TokenType.REFRESH_TOKEN,
) {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE)
    private readonly redis: Redis,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies[TokenType.REFRESH_TOKEN];
        },
      ]),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: {
    userId: Uuid;
    type: TokenType;
    jid: string;
  }): Promise<any> {
    if (args.type !== TokenType.REFRESH_TOKEN) {
      throw new InvalidateRefreshToken();
    }

    const user = await this.userService.findOne({
      id: args.userId,
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isInBlackListed = await this.redis.get(
      format(PREFIX_REFRESH_TOKEN, args.jid),
    );

    if (isInBlackListed) {
      throw new InvalidateRefreshToken();
    }

    return;
  }
}
