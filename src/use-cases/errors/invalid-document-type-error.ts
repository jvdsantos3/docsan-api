export class InvalidDocumentTypeError extends Error {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`)
  }
}
