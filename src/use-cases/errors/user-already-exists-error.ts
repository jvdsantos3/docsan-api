export class UserAlreadyExistsError extends Error {
  constructor(identifier?: string) {
    const message = identifier
      ? `User "${identifier}" already exists.`
      : `User already exists.`

    super(message)
  }
}
