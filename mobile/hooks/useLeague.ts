import { useQuery } from "@tanstack/react-query";
import { getLeagues, getLeagueById, getStandings } from "@/services/leagues";
import { config } from "@/constants/config";

export function useLeagues() {
  return useQuery({
    queryKey: ["leagues"],
    queryFn: getLeagues,
    staleTime: config.cache.staticStaleTime,
  });
}

export function useLeagueDetails(id: number | string) {
  return useQuery({
    queryKey: ["league", id],
    queryFn: () => getLeagueById(id),
    staleTime: config.cache.staticStaleTime,
  });
}

export function useStandings(leagueId: number | string) {
  return useQuery({
    queryKey: ["standings", leagueId],
    queryFn: () => getStandings(leagueId),
    staleTime: config.cache.staticStaleTime,
  });
}
