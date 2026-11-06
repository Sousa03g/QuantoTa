import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { errorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search");

    if (prisma) {
      try {
        if (search) {
          const teams = await prisma.team.findMany({
            where: {
              name: { contains: search, mode: "insensitive" },
            },
            take: 20,
          });
          return NextResponse.json({ teams });
        }

        const teams = await prisma.team.findMany({
          take: 50,
          orderBy: { name: "asc" },
        });

        if (teams.length > 0) {
          return NextResponse.json({ teams, source: "database" });
        }
      } catch (e) {
        console.warn("[Teams] DB lookup skipped:", e);
      }
    }

    return NextResponse.json({ teams: [], source: "empty" });
  } catch (error) {
    return errorResponse(error);
  }
}
