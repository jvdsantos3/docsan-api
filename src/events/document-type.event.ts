export class DocumentTypeEvent {
  constructor(
    public readonly documentTypeId: string,
    public readonly companyId: string,
    public readonly userId: string,
  ) {}
}
