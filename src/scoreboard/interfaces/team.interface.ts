export interface Team {
  name: string;
  shortName: string;
  abbreviation: string;
  image: string;
  city: string;
  state: string;
  color: string;
  league: string;
  teamId?: number;
  conference?: string;
  division?: string;
  stadium?: string;
}
