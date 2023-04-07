import { BadRequestException } from '@nestjs/common';

export class WrongCredential extends BadRequestException {
  constructor(error?: string) {
    super('Credential is wrong.', error);
  }
}
