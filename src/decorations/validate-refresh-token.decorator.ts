import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { RefreshTokenGuard } from '../guards/refresh-token.guard';

export function ValidateRefreshToken(): MethodDecorator {
  return applyDecorators(
    UseGuards(RefreshTokenGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
