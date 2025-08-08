import { BadRequestException } from "@nestjs/common";

export class CnaeAlreadyExistsError extends BadRequestException {
  constructor(identifier: string) {
    super(`Cnae "${identifier}" already exists.`)
  }
}
