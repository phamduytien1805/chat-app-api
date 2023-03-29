import { JwtStrategy } from './jwt.strategy';
import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from 'modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.authConfig.jwtExpirationTime,
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
