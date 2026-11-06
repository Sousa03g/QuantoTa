import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { errorResponse } from "@/lib/errors";
import * as footballApi from "@/lib/football-api";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    if (prisma) {
      try {
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
          },
        });

        if (team) {
          return NextResponse.json({ team, source: "database" });
        }
      } catch (e) {
        console.warn("[Team ID] DB lookup skipped:", e);
      }
    }

    const apiTeam = await footballApi.getTeam(id);
    if (apiTeam?.team) {
      return NextResponse.json({ team: apiTeam.team, source: "api" });
    }

    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  } catch (error) {
    return errorResponse(error);
  }
}
