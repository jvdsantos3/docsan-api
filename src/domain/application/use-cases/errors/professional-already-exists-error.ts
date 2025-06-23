import { UseCaseError } from "@/core/errors/use-case-error";

export class ProfessionalAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Professional "${identifier}" already exists.`);
  }
}
