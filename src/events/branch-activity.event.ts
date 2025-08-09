export class BranchActivityEvent {
  constructor(
    public readonly branchActivityId: string,
    public readonly userId: string,
  ) {}
}
