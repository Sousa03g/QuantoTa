/**
 * @file app/api/matches/[id]/route.ts
 * @description Single match details including events.
 *
 * GET /api/matches/:id
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
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

    let match: any = null;

    if (prisma) {
      try {
        match = await prisma.match.findFirst({
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
      } catch (e) {
        console.warn("[Match ID] DB lookup skipped:", e);
      }
    }

    if (!match) {
      match = await footballApi.getFixtureById(id);
    }

    if (!match) {
      throw new NotFoundError("Match", id);
    }

    return NextResponse.json({
      match,
      data: match,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
