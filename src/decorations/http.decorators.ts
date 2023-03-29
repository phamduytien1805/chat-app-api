import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';
import { AuthGuard } from '../guards/auth.guard';
export function Auth(options?: Partial<{ public: boolean }>): MethodDecorator {
  const isPublicRoute = options?.public;
  return applyDecorators(
    UseGuards(AuthGuard({ public: isPublicRoute })),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}
