import * as mongoose from 'mongoose';

export const ScoreBoardSchema = new mongoose.Schema({
  gameId: String,
  homeTeamName: String,
  homeTeamQuarters: [String],
  homeTeamScore: String,
  homeTeamRecord: String,
  homeTeamImage: String,
  homeTeamAbbreviation: String,
  homeTeamColor: String,
  awayTeamName: String,
  awayTeamQuarters: [String],
  awayTeamScore: String,
  awayTeamRecord: String,
  awayTeamImage: String,
  awayTeamAbbreviation: String,
  awayTeamColor: String,
  date: Date,
  league: String,
  status: String,
  week: Number,
});
