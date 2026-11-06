/**
 * @file app/api/matches/live/route.ts
 * @description All live (in-progress) matches.
 *
 * GET /api/matches/live
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import * as footballApi from "@/lib/football-api";
import { errorResponse } from "@/lib/errors";

const LIVE_STATUSES = ["1H", "2H", "HT", "LIVE", "ET", "BT", "P", "1st half", "2nd half", "Halftime"];

export async function GET() {
  try {
    let apiMatches: any[] = [];

    // Try DB first if connected
    if (prisma) {
      try {
        const dbMatches = await prisma.match.findMany({
          where: { status: { in: LIVE_STATUSES } },
          include: {
            league: true,
            homeTeam: true,
            awayTeam: true,
          },
          orderBy: { date: "asc" },
        });
        if (dbMatches.length > 0) {
          apiMatches = dbMatches;
        }
      } catch (e) {
        console.warn("[Matches Live] DB query skipped/failed:", e);
      }
    }

    // Direct live data from FootApi / SofaScore
    if (apiMatches.length === 0) {
      apiMatches = await footballApi.getLiveFixtures();
    }

    // Group matches by league for mobile consumption
    const groupedMap = new Map<number | string, { league: any; matches: any[] }>();

    for (const match of apiMatches) {
      const league = match.league || {
        id: match.leagueId || 0,
        name: "Outros Torneios",
        country: "Mundo",
        logo: "",
      };
      const lId = league.id || league.name;

      if (!groupedMap.has(lId)) {
        groupedMap.set(lId, {
          league: {
            id: league.id,
            name: league.name,
            country: league.country || "Mundo",
            logo: league.logo || `https://img.sofascore.com/api/v1/unique-tournament/${league.id}/image`,
          },
          matches: [],
        });
      }

      groupedMap.get(lId)!.matches.push({
        id: match.id || match.externalId,
        externalId: match.externalId || match.id,
        leagueId: league.id,
        homeTeam: match.homeTeam || { id: 0, name: "Casa", logo: "" },
        awayTeam: match.awayTeam || { id: 0, name: "Fora", logo: "" },
        homeScore: match.homeScore ?? match.goals?.home ?? 0,
        awayScore: match.awayScore ?? match.goals?.away ?? 0,
        status: match.status || "LIVE",
        date: match.date || new Date().toISOString(),
        minute: match.minute || null,
        venue: match.venue || undefined,
        events: match.events || [],
      });
    }

    const matchesByLeague = Array.from(groupedMap.values());

    return NextResponse.json({
      matchesByLeague,
      count: apiMatches.length,
      timestamp: new Date().toISOString(),
      // Legacy compat:
      data: Object.fromEntries(groupedMap),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
