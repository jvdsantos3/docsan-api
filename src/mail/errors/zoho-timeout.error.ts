export class ZohoTimeoutError extends Error {
  constructor() {
    super('Zoho request timed out.')
  }
}
