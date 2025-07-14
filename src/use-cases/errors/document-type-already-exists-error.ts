export class DocumetTypeAlreadyExistsError extends Error {
  constructor(identifier: string) {
    super(`Documet Type "${identifier}" already exists.`)
  }
}
