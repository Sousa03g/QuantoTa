import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { errorResponse } from "@/lib/errors";
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

    if (prisma) {
      try {
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
          return NextResponse.json({ standings: dbStandings, source: "database" });
        }
      } catch (e) {
        console.warn("[Standings] DB lookup skipped:", e);
      }
    }

    // Try fetching from external API
    try {
      const standingsData = await getStandings(leagueId, 2024);
      return NextResponse.json({ standings: standingsData, source: "api" });
    } catch {
      return NextResponse.json({ standings: [], source: "empty" });
    }
  } catch (error) {
    return errorResponse(error);
  }
}
