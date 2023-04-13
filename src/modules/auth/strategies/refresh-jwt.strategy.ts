import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Redis } from 'ioredis';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { format } from 'util';

import { TokenType } from '../../../constants';
import { PREFIX_REFRESH_TOKEN } from '../../../constants/redis-patterns';
import { InvalidateRefreshToken } from '../../../exceptions/invalidate-refresh-token.exception';
import { ApiConfigService } from '../../../shared/services/api-config.service';
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
        (request: Request) => request.cookies[TokenType.REFRESH_TOKEN],
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
  }
}
