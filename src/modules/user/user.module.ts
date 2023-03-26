import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettingsEntity } from './user-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSettingsEntity])],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
