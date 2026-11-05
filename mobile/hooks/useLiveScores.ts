import { useQuery } from "@tanstack/react-query";
import { getLiveMatches } from "@/services/matches";
import { config } from "@/constants/config";

export function useLiveScores() {
  return useQuery({
    queryKey: ["live-scores"],
    queryFn: getLiveMatches,
    refetchInterval: config.cache.liveRefetchInterval,
    staleTime: config.cache.liveStaleTime,
  });
}
