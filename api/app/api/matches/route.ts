/**
 * @file app/api/matches/route.ts
 * @description List matches for a date, optionally filtered by league.
 *
 * GET /api/matches?date=YYYY-MM-DD&leagueId=71
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import * as footballApi from "@/lib/football-api";
import { errorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const leagueIdParam = searchParams.get("leagueId");
    const leagueId = leagueIdParam ? parseInt(leagueIdParam, 10) : undefined;

    let apiMatches: any[] = [];

    // Try DB first if connected
    if (prisma) {
      try {
        const start = new Date(`${date}T00:00:00Z`);
        const end = new Date(`${date}T23:59:59Z`);
        const where: any = { date: { gte: start, lte: end } };
        if (leagueId) where.leagueId = leagueId;

        const dbMatches = await prisma.match.findMany({
          where,
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
        console.warn("[Matches Date] DB query skipped/failed:", e);
      }
    }

    // Fetch from Football API
    if (apiMatches.length === 0) {
      apiMatches = await footballApi.getFixtures(date, leagueId);
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
        homeScore: match.homeScore ?? match.goals?.home ?? null,
        awayScore: match.awayScore ?? match.goals?.away ?? null,
        status: match.status || "NS",
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
      date,
      // Legacy compat:
      data: Object.fromEntries(groupedMap),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
