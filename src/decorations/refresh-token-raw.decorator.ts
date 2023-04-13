import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

import { InvalidateRefreshToken } from '../exceptions/invalidate-refresh-token.exception';

export function RefreshTokenRaw() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const refreshTokenRaw = request.refreshTokenRaw;

    if (!refreshTokenRaw) {
      throw new InvalidateRefreshToken();
    }

    return refreshTokenRaw;
  })();
}
