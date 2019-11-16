export class UpdateScoreboardDto {
  readonly gameId: string;
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

export class CreateScoreboardDto {
  readonly gameId: string;
  readonly homeTeamName: string;
  readonly homeTeamQuarters: string[];
  readonly homeTeamScore: string;
  readonly homeTeamRecord: string;
  readonly homeTeamAbbreviation: string;
  readonly homeTeamImage: string;
  readonly homeTeamColor: string;
  readonly awayTeamName: string;
  readonly awayTeamQuarters: string[];
  readonly awayTeamScore: string;
  readonly awayTeamRecord: string;
  readonly awayTeamAbbreviation: string;
  readonly awayTeamImage: string;
  readonly awayTeamColor: string;
  readonly date: Date;
  readonly status: string;
  readonly league: string;
  readonly week?: number;
}
