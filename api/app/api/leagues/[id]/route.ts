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
      return NextResponse.json({ error: "Invalid league ID" }, { status: 400 });
    }

    const cacheKey = `league:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ league: cached, source: "cache" });
    }

    const league = await prisma.league.findFirst({
      where: { OR: [{ id }, { externalId: id }] },
      include: {
        matches: {
          take: 10,
          orderBy: { date: "desc" },
          include: { homeTeam: true, awayTeam: true },
        },
      },
    });

    if (!league) {
      return NextResponse.json({ error: "League not found" }, { status: 404 });
    }

    cache.set(cacheKey, league, 1800);
    return NextResponse.json({ league, source: "database" });
  } catch (error) {
    return apiError(error);
  }
}
