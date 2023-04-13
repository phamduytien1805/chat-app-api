import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Redis } from 'ioredis';
import { format } from 'util';

import { PREFIX_REFRESH_TOKEN } from '../../constants';
import { TokenType } from '../../constants/token-type';
import {
  Auth,
  AuthUser,
  RefreshTokenRaw,
  ValidateRefreshToken,
} from '../../decorations';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { RefreshTokenRawType } from './dtos/token-raw.dto';
import { UserLoginDto } from './dtos/user-login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async userRegister(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.userService.createUser(createUserDto);

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginPayloadDto, description: 'Successfully login' })
  async userLogin(
    @Res({ passthrough: true })
    res: Response, // passthrough option allows the response to be automatically sent to the client without return res.send()
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const user = await this.authService.validateUser(userLoginDto);
    const accessToken = await this.authService.createAccessToken({
      userId: user.id,
    });
    const { refreshToken } = await this.authService.createRefreshToken({
      userId: user.id,
    });

    // Set the token as a cookie header
    res.cookie(TokenType.REFRESH_TOKEN, refreshToken, { httpOnly: true });

    return new LoginPayloadDto(user.toDto(), accessToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ValidateRefreshToken()
  @ApiOkResponse({ description: 'Successfully logout' })
  async userLogout(
    @RefreshTokenRaw() refreshTokenRaw: RefreshTokenRawType,
  ): Promise<string> {
    const { exp, jid } = refreshTokenRaw;
    const now = new Date();

    return this.redis.setex(
      format(PREFIX_REFRESH_TOKEN, jid),
      exp * 1000 - now.getSeconds(),
      jid,
    );
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    type: UserDto,
    description: 'Successfully get current user info',
  })
  getMe(@AuthUser() currentUser: UserEntity): UserDto {
    return currentUser.toDto();
  }
}
