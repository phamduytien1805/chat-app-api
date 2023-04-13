import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserSettingsEntity } from './user-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSettingsEntity])],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
