import { TokenType } from './../../constants/token-type';
import { AccessTokenJWTStrategy, RefreshTokenJWTStrategy } from './strategies';
import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from 'modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { PassportModule } from '@nestjs/passport';

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
