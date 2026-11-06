import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { errorResponse } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid league ID" }, { status: 400 });
    }

    if (prisma) {
      try {
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

        if (league) {
          return NextResponse.json({ league, source: "database" });
        }
      } catch (e) {
        console.warn("[League ID] DB lookup skipped:", e);
      }
    }

    return NextResponse.json({
      league: {
        id,
        name: "Liga",
        country: "Mundo",
        logo: `https://img.sofascore.com/api/v1/unique-tournament/${id}/image`,
      },
      source: "fallback",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
