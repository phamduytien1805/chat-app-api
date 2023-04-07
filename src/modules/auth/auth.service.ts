import { Redis } from 'ioredis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserEntity } from '../user/user.entity';
import { validateHash } from '../../common/utils';
import {
  AccessTokenPayloadDto,
  RefreshTokenPayloadDto,
} from './dtos/token-data.dto';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { TokenType } from '../../constants';
import { UserNotFoundException, WrongCredential } from 'exceptions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ApiConfigService,
    private jwtService: JwtService,
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {}

  async createAccessToken(data: {
    userId: Uuid;
  }): Promise<AccessTokenPayloadDto> {
    const expiresIn =
      // this.configService.authConfig.jwtAccessTokenExpirationTime;
      '1m';
    return new AccessTokenPayloadDto({
      expiresIn: expiresIn,
      accessToken: await this.jwtService.signAsync(
        {
          userId: data.userId,
          type: TokenType.ACCESS_TOKEN,
        },
        {
          expiresIn: expiresIn,
        },
      ),
    });
  }

  async createRefreshToken(data: {
    userId: Uuid;
  }): Promise<RefreshTokenPayloadDto> {
    const expiresIn =
      this.configService.authConfig.jwtRefreshTokenExpirationTime;
    return new RefreshTokenPayloadDto({
      expiresIn: expiresIn,
      refreshToken: await this.jwtService.signAsync(
        {
          userId: data.userId,
          type: TokenType.REFRESH_TOKEN,
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
      user?.password,
    );

    if (!isPasswordValid) {
      throw new WrongCredential();
    }

    return user;
  }
}
