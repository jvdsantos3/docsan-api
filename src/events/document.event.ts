export class DocumentEvent {
  constructor(
    public readonly documentId: string,
    public readonly companyId: string,
    public readonly userId: string,
  ) {}
}
