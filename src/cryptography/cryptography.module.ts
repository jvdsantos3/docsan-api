import { Module } from '@nestjs/common'

import { JwtEncrypter } from './jwt/jwt-encrypter'
import { BcryptHasher } from './bcrypt/bcrypt-hasher'
import { Encrypter } from './encrypter'
import { HashComparer } from './hash-comparer'
import { HashGenerator } from './hash-generator'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
