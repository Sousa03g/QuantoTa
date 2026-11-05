/**
 * @file app/api/matches/live/route.ts
 * @description All live (in-progress) matches.
 *
 * GET /api/matches/live
 * Short cache (30 s). Falls back to API-Football on cache miss.
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import * as cache from "@/lib/cache";
import * as footballApi from "@/lib/football-api";
import { errorResponse } from "@/lib/errors";

const LIVE_STATUSES = ["1H", "2H", "HT", "LIVE", "ET", "BT", "P"];
const CACHE_KEY = "matches:live";
const LIVE_CACHE_TTL = 30; // seconds

export async function GET() {
  try {
    const cached = cache.get<unknown>(CACHE_KEY);
    if (cached) {
      return NextResponse.json({ data: cached });
    }

    // Try DB first
    let matches = await prisma.match.findMany({
      where: { status: { in: LIVE_STATUSES } },
      include: {
        league: true,
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: { date: "asc" },
    });

    // If DB has no live matches, ask API-Football directly
    if (matches.length === 0) {
      const apiData = (await footballApi.getLiveFixtures()) as Record<
        string,
        unknown
      >[];

      if (apiData && apiData.length > 0) {
        // Group raw API data by league and return immediately
        const grouped: Record<string, unknown[]> = {};
        for (const fixture of apiData) {
          const league = fixture.league as Record<string, unknown>;
          const name = league.name as string;
          if (!grouped[name]) grouped[name] = [];
          grouped[name].push(fixture);
        }
        cache.set(CACHE_KEY, grouped, LIVE_CACHE_TTL);
        return NextResponse.json({ data: grouped, source: "api-football" });
      }

      // Genuinely no live matches right now
      cache.set(CACHE_KEY, {}, LIVE_CACHE_TTL);
      return NextResponse.json({ data: {}, message: "No live matches at the moment." });
    }

    // Group DB matches by league
    const grouped: Record<string, typeof matches> = {};
    for (const match of matches) {
      const leagueName = match.league.name;
      if (!grouped[leagueName]) grouped[leagueName] = [];
      grouped[leagueName].push(match);
    }

    cache.set(CACHE_KEY, grouped, LIVE_CACHE_TTL);

    return NextResponse.json({ data: grouped });
  } catch (error) {
    return errorResponse(error);
  }
}
