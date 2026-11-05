import { NextResponse } from "next/js";
import { prisma } from "@/lib/db";
import { cache } from "@/lib/cache";
import { apiError } from "@/lib/errors";

const TRACKED_LEAGUE_IDS = [71, 39, 140, 135, 78, 61, 2, 13, 73];

export async function GET() {
  try {
    const cacheKey = "leagues:all";
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ leagues: cached, source: "cache" });
    }

    const leagues = await prisma.league.findMany({
      orderBy: { name: "asc" },
    });

    if (leagues.length > 0) {
      cache.set(cacheKey, leagues, 3600);
      return NextResponse.json({ leagues, source: "database" });
    }

    // Default fallback leagues if DB is not seeded yet
    const defaultLeagues = [
      { id: 1, externalId: 71, name: "Brasileirão Série A", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/71.png", type: "league", season: 2024 },
      { id: 2, externalId: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", type: "league", season: 2024 },
      { id: 3, externalId: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", type: "league", season: 2024 },
      { id: 4, externalId: 135, name: "Serie A", country: "Italy", logo: "https://media.api-sports.io/football/leagues/135.png", type: "league", season: 2024 },
      { id: 5, externalId: 78, name: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png", type: "league", season: 2024 },
      { id: 6, externalId: 61, name: "Ligue 1", country: "France", logo: "https://media.api-sports.io/football/leagues/61.png", type: "league", season: 2024 },
      { id: 7, externalId: 2, name: "UEFA Champions League", country: "World", logo: "https://media.api-sports.io/football/leagues/2.png", type: "cup", season: 2024 },
      { id: 8, externalId: 13, name: "Copa Libertadores", country: "South America", logo: "https://media.api-sports.io/football/leagues/13.png", type: "cup", season: 2024 },
      { id: 9, externalId: 73, name: "Copa do Brasil", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/73.png", type: "cup", season: 2024 },
    ];

    cache.set(cacheKey, defaultLeagues, 3600);
    return NextResponse.json({ leagues: defaultLeagues, source: "defaults" });
  } catch (error) {
    return apiError(error);
  }
}
