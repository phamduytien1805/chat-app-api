import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserEntity } from '../user/user.entity';
import { validateHash } from '../../common/utils';
import { TokenPayloadDto } from './dtos/token-data.dto';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '../../constants/token-type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ApiConfigService,
    private jwtService: JwtService,
  ) {}

  async createAccessToken(data: { userId: Uuid }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
      }),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Credential is wrong.', HttpStatus.BAD_REQUEST);
    }

    return user!;
  }
}
