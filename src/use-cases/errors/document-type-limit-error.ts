export class DocumetTypeLimitError extends Error {
  constructor(limit: number) {
    super(`Document type limit of ${limit} fields reached.`)
  }
}
