import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { TokenType } from '../constants/token-type';

export function AuthGuard(
  options?: Partial<{ public: boolean }>,
): Type<IAuthGuard> {
  const strategies: string[] = [TokenType.ACCESS_TOKEN];

  if (options?.public) {
    strategies.push('public');
  }
  return NestAuthGuard(strategies);
}
