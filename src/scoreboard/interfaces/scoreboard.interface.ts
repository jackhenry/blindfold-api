import { Document } from 'mongoose';

export interface Scoreboard extends Document {
  homeTeamName: string;
  homeTeamQuarters: string[];
  homeTeamScore: string;
  homeTeamRecord: string;
  homeTeamColor: string;
  homeTeamImage: string;
  homeTeamAbbreviation: string;
  awayTeamName: string;
  awayTeamQuarters: string[];
  awayTeamScore: string;
  awayTeamRecord: string;
  awayTeamColor: string;
  awayTeamImage: string;
  awayTeamAbbreviation: string;
  date: Date;
  league: string;
  status: string;
  week?: number;
}
