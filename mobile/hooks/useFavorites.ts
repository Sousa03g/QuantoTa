import { useEffect } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

export function useFavorites() {
  const store = useFavoritesStore();

  useEffect(() => {
    if (!store.isLoaded) {
      store.loadFavorites();
    }
  }, [store]);

  return {
    favoriteTeamIds: store.favoriteTeamIds,
    favoriteLeagueIds: store.favoriteLeagueIds,
    toggleFavoriteTeam: store.toggleFavoriteTeam,
    toggleFavoriteLeague: store.toggleFavoriteLeague,
    isFavoriteTeam: store.isFavoriteTeam,
    isFavoriteLeague: store.isFavoriteLeague,
    isLoaded: store.isLoaded,
  };
}
