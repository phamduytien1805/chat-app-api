import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import type { IUserEntity } from './user.entity';
import { UserEntity } from './user.entity';
import { UseDto } from '../../decorations';

export interface IUserSettingsEntity extends IAbstractEntity<UserDto> {
  isEmailVerified?: boolean;

  user?: IUserEntity;
}

@Entity({ name: 'user_settings' })
@UseDto(UserDto)
export class UserSettingsEntity
  extends AbstractEntity<UserDto, UserDtoOptions>
  implements IUserSettingsEntity
{
  @Column({ default: false })
  isEmailVerified?: boolean;

  @Column({ type: 'uuid' })
  userId?: string;

  @OneToOne(() => UserEntity, (user) => user.settings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
