import api from "./api";

export interface Team {
  id: number;
  externalId: number;
  name: string;
  shortName?: string;
  logo: string;
}

export interface MatchEvent {
  id: number;
  minute: number;
  type: string;
  playerName?: string;
  detail?: string;
}

export interface Match {
  id: number;
  externalId: number;
  leagueId: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
  minute: number | null;
  venue?: string;
  events?: MatchEvent[];
}

export interface MatchesByLeague {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
  };
  matches: Match[];
}

export async function getMatchesByDate(date: string): Promise<MatchesByLeague[]> {
  const { data } = await api.get(`/matches?date=${date}`);
  return data.matchesByLeague || [];
}

export async function getLiveMatches(): Promise<MatchesByLeague[]> {
  const { data } = await api.get("/matches/live");
  return data.matchesByLeague || [];
}

export async function getMatchById(id: number | string): Promise<Match> {
  const { data } = await api.get(`/matches/${id}`);
  return data.match;
}
