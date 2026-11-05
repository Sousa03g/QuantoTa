import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getLiveFixtures } from "@/lib/football-api";
import { cache } from "@/lib/cache";

/**
 * Cron sync endpoint called every 5 minutes by Vercel Cron.
 * Syncs currently live matches and updates the database.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const liveFixtures = await getLiveFixtures();
    let updatedCount = 0;

    for (const item of (liveFixtures as any[])) {
      const { fixture, teams, goals } = item;
      const externalId = fixture.id;

      // Upsert home team
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

      // Upsert away team
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

      // Upsert league
      const league = await prisma.league.upsert({
        where: { externalId: item.league.id },
        update: { name: item.league.name, logo: item.league.logo },
        create: {
          externalId: item.league.id,
          name: item.league.name,
          logo: item.league.logo,
          country: item.league.country || "World",
          type: "league",
          season: item.league.season || 2024,
        },
      });

      // Upsert match
      await prisma.match.upsert({
        where: { externalId },
        update: {
          homeScore: goals.home,
          awayScore: goals.away,
          status: fixture.status.short,
          minute: fixture.status.elapsed,
        },
        create: {
          externalId,
          leagueId: league.id,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeScore: goals.home,
          awayScore: goals.away,
          status: fixture.status.short,
          minute: fixture.status.elapsed,
          date: new Date(fixture.date),
          season: item.league.season || 2024,
        },
      });

      updatedCount++;
    }

    // Invalidate live matches cache
    cache.del("matches:live");

    return NextResponse.json({
      status: "synced",
      matchesUpdated: updatedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
