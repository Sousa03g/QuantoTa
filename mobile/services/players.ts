import api from "./api";

export interface PlayerDetail {
  id: number;
  externalId: number;
  name: string;
  photo?: string;
  nationality: string;
  position: string;
  age?: number;
  number?: number;
  team?: {
    id: number;
    name: string;
    logo: string;
  };
}

export async function getPlayerById(id: number | string): Promise<PlayerDetail> {
  const { data } = await api.get(`/players/${id}`);
  return data.player;
}
