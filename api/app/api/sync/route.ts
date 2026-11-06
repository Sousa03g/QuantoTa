import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getLiveFixtures } from "@/lib/football-api";
import * as cache from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const liveFixtures = await getLiveFixtures();
    let updatedCount = 0;

    if (prisma) {
      for (const item of (liveFixtures as any[])) {
        try {
          const { fixture, teams, goals, league } = item;
          if (!fixture || !teams?.home || !teams?.away) continue;

          const homeTeam = await prisma.team.upsert({
            where: { externalId: teams.home.id },
            update: { name: teams.home.name, logo: teams.home.logo },
            create: {
              externalId: teams.home.id,
              name: teams.home.name,
              logo: teams.home.logo,
              country: "Unknown",
            },
          });

          const awayTeam = await prisma.team.upsert({
            where: { externalId: teams.away.id },
            update: { name: teams.away.name, logo: teams.away.logo },
            create: {
              externalId: teams.away.id,
              name: teams.away.name,
              logo: teams.away.logo,
              country: "Unknown",
            },
          });

          let dbLeague = null;
          if (league?.id) {
            dbLeague = await prisma.league.upsert({
              where: { externalId: league.id },
              update: { name: league.name, logo: league.logo },
              create: {
                externalId: league.id,
                name: league.name,
                country: league.country || "Mundo",
                logo: league.logo || "",
                type: "league",
                season: 2024,
              },
            });
          }

          if (dbLeague) {
            await prisma.match.upsert({
              where: { externalId: fixture.id },
              update: {
                homeScore: goals.home ?? 0,
                awayScore: goals.away ?? 0,
                status: fixture.status?.short || "LIVE",
                minute: fixture.status?.elapsed ?? null,
              },
              create: {
                externalId: fixture.id,
                leagueId: dbLeague.id,
                homeTeamId: homeTeam.id,
                awayTeamId: awayTeam.id,
                homeScore: goals.home ?? 0,
                awayScore: goals.away ?? 0,
                status: fixture.status?.short || "LIVE",
                date: new Date(fixture.date),
                minute: fixture.status?.elapsed ?? null,
                season: 2024,
              },
            });
            updatedCount++;
          }
        } catch {
          // ignore single item failure
        }
      }
    }

    cache.set("fixtures:live", liveFixtures, 15);

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      liveMatchesCount: liveFixtures.length,
      updatedInDb: updatedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
