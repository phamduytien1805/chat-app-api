import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import type { IUserEntity } from './user.entity';
import { UserEntity } from './user.entity';
import { UseDto } from '../../decorations';

export interface IUserRefreshToken extends IAbstractEntity<UserDto> {
  refreshToken: string;
  user?: IUserEntity;
}

@Entity({ name: 'user_refresh_tokens' })
@UseDto(UserDto)
export class UserRefreshTokensEntity
  extends AbstractEntity<UserDto, UserDtoOptions>
  implements IUserRefreshToken
{
  @Column({ unique: true })
  refreshToken: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
