import { BadRequestException } from "@nestjs/common";

export class BranchActivityAlreadyExistsError extends BadRequestException {
  constructor(identifier: string) {
    super(`Branch activity "${identifier}" already exists.`)
  }
}
