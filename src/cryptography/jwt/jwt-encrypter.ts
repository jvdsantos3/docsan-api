import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { Encrypter } from '../encrypter'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>, options: JwtSignOptions) {
    return this.jwtService.signAsync(payload, options)
  }

  verify(token: string) {
    return this.jwtService.verifyAsync(token)
  }
}
