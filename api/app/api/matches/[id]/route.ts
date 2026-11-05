/**
 * @file app/api/matches/[id]/route.ts
 * @description Single match details including events.
 *
 * GET /api/matches/:id
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import * as cache from "@/lib/cache";
import * as footballApi from "@/lib/football-api";
import { NotFoundError, errorResponse } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      throw new NotFoundError("Match", params.id);
    }

    const cacheKey = `match:${id}`;
    const cached = cache.get<unknown>(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached });
    }

    // Try to find by internal id first, then by externalId
    let match = await prisma.match.findFirst({
      where: { OR: [{ id }, { externalId: id }] },
      include: {
        league: true,
        homeTeam: true,
        awayTeam: true,
        events: {
          include: { team: true },
          orderBy: [{ minute: "asc" }, { extraMinute: "asc" }],
        },
      },
    });

    // If not found locally, try fetching from API-Football
    if (!match) {
      const apiData = (await footballApi.getFixtureById(id)) as Record<
        string,
        unknown
      >[];

      if (!apiData || apiData.length === 0) {
        throw new NotFoundError("Match", id);
      }

      // We won't auto-upsert here — just return the raw API data
      // The sync endpoint handles persistence.
      const rawFixture = apiData[0];
      cache.set(cacheKey, rawFixture, cache.TTL.LIVE);
      return NextResponse.json({ data: rawFixture, source: "api-football" });
    }

    // Determine TTL based on match status
    const isLive = ["1H", "2H", "HT", "LIVE"].includes(match.status);
    cache.set(cacheKey, match, isLive ? 30 : cache.TTL.LIVE);

    return NextResponse.json({ data: match });
  } catch (error) {
    return errorResponse(error);
  }
}
