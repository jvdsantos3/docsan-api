export class OwnerAlreadyExistsError extends Error {
  constructor(identifier: string) {
    super(`Owner "${identifier}" already exists.`)
  }
}
