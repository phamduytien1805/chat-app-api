import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { RefreshTokenGuard } from '../guards/refresh-token.guard';

export function ValidateRefreshToken(): MethodDecorator {
  return applyDecorators(
    UseGuards(RefreshTokenGuard),
    ApiCookieAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized! Invalid refresh token!',
    }),
  );
}
