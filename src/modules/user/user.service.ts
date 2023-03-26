import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { UserSettingsEntity } from './user-settings.entity';
import { plainToClass } from 'class-transformer';
import { CreateSettingsDto } from './dtos/create-settings.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserSettingsEntity)
    private userSettingsRepository: Repository<UserSettingsEntity>,
  ) {}

  @Transactional()
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    const userSettings = this.userSettingsRepository.create(
      plainToClass(CreateSettingsDto, {
        isEmailVerified: false,
        isPhoneVerified: false,
      }),
    );
    userSettings.userId = user.id;

    user.settings = await this.userSettingsRepository.save(userSettings);

    return user;
  }
}
