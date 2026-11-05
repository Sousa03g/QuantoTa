import { useQuery } from "@tanstack/react-query";
import { getMatchesByDate, getLiveMatches, getMatchById } from "@/services/matches";
import { config } from "@/constants/config";

export function useMatchesByDate(date: string) {
  return useQuery({
    queryKey: ["matches", date],
    queryFn: () => getMatchesByDate(date),
    staleTime: config.cache.matchListStaleTime,
  });
}

export function useLiveMatches() {
  return useQuery({
    queryKey: ["matches", "live"],
    queryFn: () => getLiveMatches(),
    refetchInterval: config.cache.liveRefetchInterval,
    staleTime: config.cache.liveStaleTime,
  });
}

export function useMatchDetails(id: number | string) {
  return useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatchById(id),
    refetchInterval: (query) => {
      const match = query.state.data;
      const liveStatuses = ["1H", "HT", "2H", "LIVE", "ET", "P"];
      return match && liveStatuses.includes(match.status) ? 30000 : false;
    },
  });
}
