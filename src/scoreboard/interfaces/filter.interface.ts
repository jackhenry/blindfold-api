import { Document } from 'mongoose';

export interface Filter extends Document {
  league: string;
  filterValue: number;
  filterLabel: string;
}
