import { AccessTokenPayloadDto } from './token-data.dto';
import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dtos/user.dto';

export class LoginPayloadDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: AccessTokenPayloadDto })
  token: AccessTokenPayloadDto;

  constructor(user: UserDto, token: AccessTokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
