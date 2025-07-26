import { BadRequestException } from "@nestjs/common";

export class DocumetTypeAlreadyExistsError extends BadRequestException {
  constructor(identifier: string) {
    super(`Documet Type "${identifier}" already exists.`)
  }
}
