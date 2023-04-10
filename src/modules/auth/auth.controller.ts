import { ContextProvider } from './../../providers/context.provider';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserDto } from 'modules/user/dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserLoginDto } from './dtos/user-login.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { UserEntity } from '../user/user.entity';
import { Auth, AuthUser, Cookies } from '../../decorations';
import { Response } from 'express';
import { TokenType } from '../../constants/token-type';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { format } from 'util';
// import { PREFIX_REFRESH_TOKEN } from 'constants';

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
    @Res({ passthrough: true }) res: Response, // passthrough option allows the response to be automatically sent to the client without return res.send()
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
  @Auth()
  @ApiOkResponse({ description: 'Successfully logout' })
  async userLogout(
    @Cookies(TokenType.REFRESH_TOKEN) refreshToken: string,
    @AuthUser() currentUser: UserEntity,
  ): Promise<boolean> {
    console.log('refreshToken', refreshToken);
    return true;
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
