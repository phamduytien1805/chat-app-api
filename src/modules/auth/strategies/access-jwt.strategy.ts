import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenType } from '../../../constants';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import type { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import type { AccessTokenRawType } from '../dtos/token-raw.dto';

@Injectable()
export class AccessTokenJWTStrategy extends PassportStrategy(
  Strategy,
  TokenType.ACCESS_TOKEN,
) {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: AccessTokenRawType): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({
      id: args.userId,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
