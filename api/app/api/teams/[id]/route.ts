import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cache } from "@/lib/cache";
import { apiError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    const cacheKey = `team:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ team: cached, source: "cache" });
    }

    const team = await prisma.team.findFirst({
      where: { OR: [{ id }, { externalId: id }] },
      include: {
        players: {
          orderBy: { name: "asc" },
        },
        homeMatches: {
          take: 5,
          orderBy: { date: "desc" },
          include: { league: true, homeTeam: true, awayTeam: true },
        },
        awayMatches: {
          take: 5,
          orderBy: { date: "desc" },
          include: { league: true, homeTeam: true, awayTeam: true },
        },
        standings: {
          include: { league: true },
          orderBy: { season: "desc" },
          take: 1,
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    cache.set(cacheKey, team, 1800);
    return NextResponse.json({ team, source: "database" });
  } catch (error) {
    return apiError(error);
  }
}
