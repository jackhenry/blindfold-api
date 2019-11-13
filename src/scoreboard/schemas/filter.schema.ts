import * as mongoose from 'mongoose';

export const FilterSchema = new mongoose.Schema({
  league: String,
  filterValue: Number,
  filterLabel: String,
});
