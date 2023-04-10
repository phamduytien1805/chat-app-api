import { UnauthorizedException } from '@nestjs/common';

export class InvalidateRefreshToken extends UnauthorizedException {
  constructor(error?: string) {
    super('Refresh token is invalidated', error);
  }
}
