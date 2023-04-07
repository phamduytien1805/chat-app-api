import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenPayloadDto {
  @ApiProperty()
  expiresIn: string | number;

  @ApiProperty()
  accessToken: string;

  constructor(data: { expiresIn: number | string; accessToken: string }) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
  }
}

export class RefreshTokenPayloadDto {
  @ApiProperty()
  expiresIn: string | number;

  @ApiProperty()
  refreshToken: string;

  constructor(data: { expiresIn: number | string; refreshToken: string }) {
    this.expiresIn = data.expiresIn;
    this.refreshToken = data.refreshToken;
  }
}
