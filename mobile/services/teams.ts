import api from "./api";

export interface TeamDetail {
  id: number;
  externalId: number;
  name: string;
  shortName?: string;
  logo: string;
  country: string;
  founded?: number;
  venue?: string;
  players?: Array<{
    id: number;
    name: string;
    photo?: string;
    position: string;
    number?: number;
    age?: number;
  }>;
  homeMatches?: any[];
  awayMatches?: any[];
}

export async function getTeams(search?: string): Promise<TeamDetail[]> {
  const url = search ? `/teams?search=${encodeURIComponent(search)}` : "/teams";
  const { data } = await api.get(url);
  return data.teams || [];
}

export async function getTeamById(id: number | string): Promise<TeamDetail> {
  const { data } = await api.get(`/teams/${id}`);
  return data.team;
}
