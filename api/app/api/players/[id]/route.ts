import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cache } from "@/lib/cache";
import { apiError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
    }

    const cacheKey = `player:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ player: cached, source: "cache" });
    }

    const player = await prisma.player.findFirst({
      where: { OR: [{ id }, { externalId: id }] },
      include: {
        team: true,
      },
    });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    cache.set(cacheKey, player, 3600);
    return NextResponse.json({ player, source: "database" });
  } catch (error) {
    return apiError(error);
  }
}
