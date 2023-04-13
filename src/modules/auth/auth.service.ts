import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { validateHash } from '../../common/utils';
import { TokenType } from '../../constants';
import { UserNotFoundException, WrongCredential } from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import {
  AccessTokenPayloadDto,
  RefreshTokenPayloadDto,
} from './dtos/token-data.dto';
import type { UserLoginDto } from './dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ApiConfigService,
    private jwtService: JwtService,
  ) {}

  async createAccessToken(data: {
    userId: Uuid;
  }): Promise<AccessTokenPayloadDto> {
    const expiresIn =
      // this.configService.authConfig.jwtAccessTokenExpirationTime;
      '1m';

    return new AccessTokenPayloadDto({
      expiresIn,
      accessToken: await this.jwtService.signAsync(
        {
          userId: data.userId,
          type: TokenType.ACCESS_TOKEN,
        },
        {
          expiresIn,
        },
      ),
    });
  }

  async createRefreshToken(data: {
    userId: Uuid;
  }): Promise<RefreshTokenPayloadDto> {
    const jid = uuidv4();

    const expiresIn =
      this.configService.authConfig.jwtRefreshTokenExpirationTime;

    return new RefreshTokenPayloadDto({
      expiresIn,
      refreshToken: await this.jwtService.signAsync(
        {
          userId: data.userId,
          type: TokenType.REFRESH_TOKEN,
          jid,
        },
        {
          expiresIn,
        },
      ),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new WrongCredential();
    }

    return user;
  }
}
