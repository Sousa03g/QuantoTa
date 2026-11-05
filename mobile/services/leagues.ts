import api from "./api";

export interface League {
  id: number;
  externalId: number;
  name: string;
  country: string;
  logo: string;
  type: string;
  season: number;
}

export interface Standing {
  id: number;
  rank: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  form?: string;
  team: {
    id: number;
    externalId: number;
    name: string;
    logo: string;
  };
}

export async function getLeagues(): Promise<League[]> {
  const { data } = await api.get("/leagues");
  return data.leagues || [];
}

export async function getLeagueById(id: number | string): Promise<League> {
  const { data } = await api.get(`/leagues/${id}`);
  return data.league;
}

export async function getStandings(leagueId: number | string): Promise<Standing[]> {
  const { data } = await api.get(`/leagues/${leagueId}/standings`);
  return data.standings || [];
}
