
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class ScoreboardInput {
    gameId: string;
    league: string;
    date: DateTime;
    status: string;
    week?: number;
    homeTeamName: string;
    homeTeamQuarters: string[];
    homeTeamScore: string;
    homeTeamRecord?: string;
    awayTeamName: string;
    awayTeamQuarters: string[];
    awayTeamScore: string;
    awayTeamRecord?: string;
}

export class Filter {
    league: string;
    filterLabel: string;
    filterValue: number;
}

export abstract class IMutation {
    abstract createScoreboard(input?: ScoreboardInput): Scoreboard | Promise<Scoreboard>;
}

export abstract class IQuery {
    abstract socreboard(id?: string): Scoreboard | Promise<Scoreboard>;

    abstract scoreboards(league?: string, filterValue?: number): Scoreboard[] | Promise<Scoreboard[]>;

    abstract findScoreboards(league?: string): Scoreboard[] | Promise<Scoreboard[]>;

    abstract filters(league?: string): Filter[] | Promise<Filter[]>;
}

export class Scoreboard {
    gameId?: string;
    league?: string;
    date?: DateTime;
    status?: string;
    homeTeamName?: string;
    homeTeamQuarters?: string[];
    homeTeamScore?: string;
    homeTeamRecord?: string;
    homeTeamImage?: string;
    homeTeamAbbreviation?: string;
    homeTeamColor?: string;
    awayTeamName?: string;
    awayTeamQuarters?: string[];
    awayTeamScore?: string;
    awayTeamRecord?: string;
    awayTeamImage?: string;
    awayTeamAbbreviation?: string;
    awayTeamColor?: string;
}

export type DateTime = any;
