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

import { TokenType } from '../../constants';
import {
  Auth,
  AuthUser,
  RefreshTokenRaw,
  ValidateRefreshToken,
} from '../../decorations';
import { UserDto } from '../user/dtos';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AccessTokenPayloadDto } from './dtos/token-data.dto';
import {
  CreateUserDto,
  LoginPayloadDto,
  RefreshTokenRawType,
  UserLoginDto,
} from './dtos';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
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
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    response.clearCookie(TokenType.REFRESH_TOKEN);

    return this.authService.setRefreshTokenToBlacklist(refreshTokenRaw);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ValidateRefreshToken()
  @ApiOkResponse({
    type: AccessTokenPayloadDto,
    description: 'Successfully get new access token',
  })
  async userRefreshToken(
    @RefreshTokenRaw() refreshTokenRaw: RefreshTokenRawType,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenPayloadDto> {
    const { userId } = refreshTokenRaw;

    const accessToken = await this.authService.createAccessToken({
      userId,
    });
    const { refreshToken } = await this.authService.createRefreshToken({
      userId,
    });

    res.cookie(TokenType.REFRESH_TOKEN, refreshToken, { httpOnly: true });

    await this.authService.setRefreshTokenToBlacklist(refreshTokenRaw); // remove current refresh token

    return accessToken;
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
