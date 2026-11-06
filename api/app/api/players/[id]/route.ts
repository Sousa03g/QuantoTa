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
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
    }

    if (prisma) {
      try {
        const player = await prisma.player.findFirst({
          where: { OR: [{ id }, { externalId: id }] },
          include: {
            team: true,
          },
        });

        if (player) {
          return NextResponse.json({ player, source: "database" });
        }
      } catch (e) {
        console.warn("[Player ID] DB lookup skipped:", e);
      }
    }

    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } catch (error) {
    return errorResponse(error);
  }
}
