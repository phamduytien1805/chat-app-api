import { BooleanFieldOptional } from '../../../decorations';

export class CreateSettingsDto {
  @BooleanFieldOptional()
  isEmailVerified: boolean;

  @BooleanFieldOptional()
  isPhoneVerified: boolean;
}
