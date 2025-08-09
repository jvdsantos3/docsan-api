export class RegistryTypeEvent {
  constructor(
    public readonly registryTypeId: string,
    public readonly userId: string,
  ) {}
}
