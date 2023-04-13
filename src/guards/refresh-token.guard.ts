import { Injectable } from '@nestjs/common';
import type { IAuthModuleOptions } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

import { TokenType } from '../constants/token-type';
@Injectable()
export class RefreshTokenGuard extends NestAuthGuard(TokenType.REFRESH_TOKEN) {
  getAuthenticateOptions(): IAuthModuleOptions<any> | undefined {
    return {
      property: 'refreshTokenRaw',
    };
  }
}
