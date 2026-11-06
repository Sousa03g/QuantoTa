/**
 * @file app/api/leagues/route.ts
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import * as footballApi from "@/lib/football-api";
import { errorResponse } from "@/lib/errors";

export async function GET() {
  try {
    if (prisma) {
      try {
        const leagues = await prisma.league.findMany({
          orderBy: { name: "asc" },
        });
        if (leagues.length > 0) {
          return NextResponse.json({ leagues, source: "database" });
        }
      } catch (e) {
        console.warn("[Leagues] DB lookup skipped:", e);
      }
    }

    const rawLeagues = await footballApi.getLeagues();
    const leagues = rawLeagues.map((item: any) => {
      const l = item.league || item;
      return {
        id: l.id,
        externalId: l.id,
        name: l.name,
        country: item.country?.name || l.country || "Mundo",
        logo: l.logo || `https://img.sofascore.com/api/v1/unique-tournament/${l.id}/image`,
        type: l.type || "league",
        season: 2024,
      };
    });

    return NextResponse.json({ leagues, source: "api" });
  } catch (error) {
    return errorResponse(error);
  }
}
