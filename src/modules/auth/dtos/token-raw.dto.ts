/* eslint-disable max-classes-per-file */
import type { TokenType } from '../../../constants';

export class JWTRawType {
  iat: number;

  exp: number;

  userId: Uuid;

  type: TokenType;
}

export class RefreshTokenRawType extends JWTRawType {
  jid: string;
}

export class AccessTokenRawType extends JWTRawType {}
