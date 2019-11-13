export class CreateScoreboardDto {
  readonly homeTeamName: string;
  readonly homeTeamQuarters: string[];
  readonly homeTeamScore: string;
  readonly homeTeamRecord: string;
  readonly awayTeamName: string;
  readonly awayTeamQuarters: string[];
  readonly awayTeamScore: string;
  readonly awayTeamRecord: string;
  readonly date: Date;
  readonly status: string;
  readonly league: string;
  readonly week?: number;
}
