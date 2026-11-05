/**
 * @file app/api/matches/route.ts
 * @description List matches for a date, optionally filtered by league.
 *
 * GET /api/matches?date=YYYY-MM-DD&leagueId=71
 *
 * Returns matches grouped by league. If the DB has no matches for the
 * requested date, it triggers a sync from API-Football.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import * as cache from "@/lib/cache";
import * as footballApi from "@/lib/football-api";
import { BadRequestError, errorResponse } from "@/lib/errors";

/** Upsert a team from API-Football fixture payload, returning the DB id. */
async function upsertTeam(team: Record<string, unknown>): Promise<number> {
  const record = await prisma.team.upsert({
    where: { externalId: team.id as number },
    update: {
      name: team.name as string,
      logo: (team.logo as string) ?? "",
    },
    create: {
      externalId: team.id as number,
      name: team.name as string,
      shortName: null,
      logo: (team.logo as string) ?? "",
      country: "",
    },
  });
  return record.id;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const date = searchParams.get("date");
    const leagueIdParam = searchParams.get("leagueId");

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestError("Query parameter 'date' is required (YYYY-MM-DD).");
    }

    const cacheKey = `matches:${date}:${leagueIdParam ?? "all"}`;
    const cached = cache.get<unknown>(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached });
    }

    // Build date range for the day
    const start = new Date(`${date}T00:00:00Z`);
    const end = new Date(`${date}T23:59:59Z`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      date: { gte: start, lte: end },
    };

    if (leagueIdParam) {
      const league = await prisma.league.findUnique({
        where: { externalId: parseInt(leagueIdParam, 10) },
      });
      if (league) where.leagueId = league.id;
    }

    let matches = await prisma.match.findMany({
      where,
      include: {
        league: true,
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: { date: "asc" },
    });

    // If empty, attempt to sync from API-Football
    if (matches.length === 0) {
      const leagueExtId = leagueIdParam
        ? parseInt(leagueIdParam, 10)
        : undefined;
      const apiFixtures = (await footballApi.getFixtures(
        date,
        leagueExtId,
      )) as Record<string, unknown>[];

      for (const fixture of apiFixtures) {
        const f = fixture.fixture as Record<string, unknown>;
        const league = fixture.league as Record<string, unknown>;
        const teams = fixture.teams as Record<string, Record<string, unknown>>;
        const goals = fixture.goals as Record<string, number | null>;
        const status = f.status as Record<string, unknown>;

        // Ensure league exists
        const dbLeague = await prisma.league.upsert({
          where: { externalId: league.id as number },
          update: {},
          create: {
            externalId: league.id as number,
            name: league.name as string,
            country: (league.country as string) ?? "",
            logo: (league.logo as string) ?? "",
            type: (league.type as string) ?? "league",
            season: (league.season as number) ?? new Date().getFullYear(),
          },
        });

        const homeTeamId = await upsertTeam(teams.home);
        const awayTeamId = await upsertTeam(teams.away);

        await prisma.match.upsert({
          where: { externalId: f.id as number },
          update: {
            homeScore: goals.home ?? null,
            awayScore: goals.away ?? null,
            status: (status.short as string) ?? "NS",
            minute: (status.elapsed as number) ?? null,
          },
          create: {
            externalId: f.id as number,
            leagueId: dbLeague.id,
            homeTeamId,
            awayTeamId,
            homeScore: goals.home ?? null,
            awayScore: goals.away ?? null,
            status: (status.short as string) ?? "NS",
            date: new Date(f.date as string),
            minute: (status.elapsed as number) ?? null,
            venue: (f.venue as Record<string, unknown>)?.name as string ?? null,
            referee: (f.referee as string) ?? null,
            season: (league.season as number) ?? new Date().getFullYear(),
          },
        });
      }

      // Re-query
      matches = await prisma.match.findMany({
        where,
        include: {
          league: true,
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { date: "asc" },
      });
    }

    // Group by league
    const grouped: Record<string, unknown[]> = {};
    for (const match of matches) {
      const leagueName = match.league.name;
      if (!grouped[leagueName]) grouped[leagueName] = [];
      grouped[leagueName].push(match);
    }

    cache.set(cacheKey, grouped, cache.TTL.LIVE);

    return NextResponse.json({ data: grouped });
  } catch (error) {
    return errorResponse(error);
  }
}
