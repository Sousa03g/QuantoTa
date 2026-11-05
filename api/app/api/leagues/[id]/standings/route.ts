import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cache } from "@/lib/cache";
import { apiError } from "@/lib/errors";
import { getStandings } from "@/lib/football-api";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leagueId = parseInt(params.id, 10);
    if (isNaN(leagueId)) {
      return NextResponse.json({ error: "Invalid league ID" }, { status: 400 });
    }

    const cacheKey = `standings:${leagueId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ standings: cached, source: "cache" });
    }

    const dbStandings = await prisma.standing.findMany({
      where: {
        OR: [
          { leagueId },
          { league: { externalId: leagueId } },
        ],
      },
      include: { team: true, league: true },
      orderBy: { rank: "asc" },
    });

    if (dbStandings.length > 0) {
      cache.set(cacheKey, dbStandings, 300);
      return NextResponse.json({ standings: dbStandings, source: "database" });
    }

    // Try fetching from external API if not found
    try {
      const apiResponse = await getStandings(leagueId, 2024);
      if (apiResponse && apiResponse.length > 0) {
        const standingsData = (apiResponse[0] as any)?.league?.standings?.[0] ?? [];
        cache.set(cacheKey, standingsData, 300);
        return NextResponse.json({ standings: standingsData, source: "api-football" });
      }
    } catch {
      // Return empty if external fails
    }

    return NextResponse.json({ standings: [], source: "none" });
  } catch (error) {
    return apiError(error);
  }
}
