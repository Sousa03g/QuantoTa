import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  favoriteTeamIds: number[];
  favoriteLeagueIds: number[];
  isLoaded: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavoriteTeam: (id: number) => Promise<void>;
  toggleFavoriteLeague: (id: number) => Promise<void>;
  isFavoriteTeam: (id: number) => boolean;
  isFavoriteLeague: (id: number) => boolean;
}

const STORAGE_KEYS = {
  TEAMS: "@quantota_fav_teams",
  LEAGUES: "@quantota_fav_leagues",
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteTeamIds: [127, 529], // Defaults: Flamengo, Barcelona
  favoriteLeagueIds: [71, 2],   // Defaults: Brasileirão, Champions League
  isLoaded: false,

  loadFavorites: async () => {
    try {
      const [teamsJson, leaguesJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TEAMS),
        AsyncStorage.getItem(STORAGE_KEYS.LEAGUES),
      ]);
      set({
        favoriteTeamIds: teamsJson ? JSON.parse(teamsJson) : [127, 529],
        favoriteLeagueIds: leaguesJson ? JSON.parse(leaguesJson) : [71, 2],
        isLoaded: true,
      });
    } catch {
      set({ isLoaded: true });
    }
  },

  toggleFavoriteTeam: async (id: number) => {
    const { favoriteTeamIds } = get();
    const exists = favoriteTeamIds.includes(id);
    const updated = exists
      ? favoriteTeamIds.filter((tId) => tId !== id)
      : [...favoriteTeamIds, id];

    set({ favoriteTeamIds: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(updated));
  },

  toggleFavoriteLeague: async (id: number) => {
    const { favoriteLeagueIds } = get();
    const exists = favoriteLeagueIds.includes(id);
    const updated = exists
      ? favoriteLeagueIds.filter((lId) => lId !== id)
      : [...favoriteLeagueIds, id];

    set({ favoriteLeagueIds: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.LEAGUES, JSON.stringify(updated));
  },

  isFavoriteTeam: (id: number) => get().favoriteTeamIds.includes(id),
  isFavoriteLeague: (id: number) => get().favoriteLeagueIds.includes(id),
}));
