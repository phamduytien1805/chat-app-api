import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserModule } from '../user/user.module';
import { TokenType } from './../../constants/token-type';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenJWTStrategy, RefreshTokenJWTStrategy } from './strategies';

const strategyProviders = [AccessTokenJWTStrategy, RefreshTokenJWTStrategy];
@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: [TokenType.ACCESS_TOKEN, TokenType.REFRESH_TOKEN],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [...strategyProviders, AuthService],
})
export class AuthModule {}
