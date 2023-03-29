import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { Auth, AuthUser } from '../../decorations';

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
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const user = await this.authService.validateUser(userLoginDto);
    const token = await this.authService.createAccessToken({ userId: user.id });
    return new LoginPayloadDto(user.toDto(), token);
  }

  @Version('1')
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
