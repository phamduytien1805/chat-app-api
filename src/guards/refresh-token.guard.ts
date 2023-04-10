import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import type { IAuthGuard, Type } from '@nestjs/passport';
import { TokenType } from '../constants/token-type';
// @Injectable()
// export class RefreshTokenGuard extends NestAuthGuard() {
//   constructor(private reflector: Reflector) {
//     super();
//   }

//   canActivate(context: ExecutionContext) {
//     const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     console.log('this.reflector', this.reflector);

//     if (isPublic) {
//       return true;
//     }

//     return super.canActivate(context);
//   }
// }

export function RefreshTokenGuard(): Type<IAuthGuard> {
  const strategies: string[] = [TokenType.ACCESS_TOKEN];
  return NestAuthGuard(strategies);
}
