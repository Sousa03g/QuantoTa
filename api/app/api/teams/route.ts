import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cache } from "@/lib/cache";
import { apiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search");

    if (search) {
      const teams = await prisma.team.findMany({
        where: {
          name: { contains: search, mode: "insensitive" },
        },
        take: 20,
      });
      return NextResponse.json({ teams });
    }

    const cacheKey = "teams:popular";
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ teams: cached, source: "cache" });
    }

    const teams = await prisma.team.findMany({
      take: 50,
      orderBy: { name: "asc" },
    });

    cache.set(cacheKey, teams, 1800);
    return NextResponse.json({ teams, source: "database" });
  } catch (error) {
    return apiError(error);
  }
}
