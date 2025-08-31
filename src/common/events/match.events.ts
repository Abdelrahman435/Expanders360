export class MatchCreatedEvent {
  constructor(
    public readonly matchId: number,
    public readonly projectId: number,
    public readonly vendorId: number,
    public readonly score: number,
  ) {}
}

export class MatchUpdatedEvent {
  constructor(
    public readonly matchId: number,
    public readonly oldScore: number,
    public readonly newScore: number,
  ) {}
}

export class SLAExpiredEvent {
  constructor(
    public readonly vendorId: number,
    public readonly vendorName: string,
    public readonly expiryDate: Date,
  ) {}
}
