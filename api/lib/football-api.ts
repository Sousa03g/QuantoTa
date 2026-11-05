/**
 * @file lib/football-api.ts
 * @description Universal Football API Client.
 * Supports:
 * 1. RapidAPI "Free API Live Football Data" (free-api-live-football-data.p.rapidapi.com)
 * 2. RapidAPI "API-Football v3" (api-football-v1.p.rapidapi.com)
 * 3. Direct API-Sports (v3.football.api-sports.io)
 */

import axios, { AxiosInstance } from "axios";

const apiKey = process.env.FOOTBALL_API_KEY ?? "";
const host = process.env.FOOTBALL_API_HOST ?? "free-api-live-football-data.p.rapidapi.com";
const isFreeLiveFootballApi = host.includes("free-api-live-football-data");

/** Configured axios instance for Football API */
const api: AxiosInstance = axios.create({
  baseURL: `https://${host}`,
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": host,
    "x-apisports-key": apiKey,
  },
  timeout: 15_000,
});

/* ------------------------------------------------------------------ */
/*  Public functions with dual provider support                        */
/* ------------------------------------------------------------------ */

/**
 * Fetch fixtures for a given date (YYYY-MM-DD or YYYYMMDD), optionally filtered by league.
 */
export async function getFixtures(date: string, leagueId?: number): Promise<any[]> {
  if (isFreeLiveFootballApi) {
    const cleanDate = date.replace(/-/g, "");
    const { data } = await api.get("/football-get-matches-by-date", {
      params: { date: cleanDate },
    });
    const matches = data?.response?.matches || [];
    
    // Normalize to standard shape
    return matches.map((m: any) => ({
      fixture: {
        id: m.id,
        date: m.status?.utcTime || new Date(m.timeTS || Date.now()).toISOString(),
        status: {
          short: m.status?.reason?.short || (m.status?.finished ? "FT" : m.status?.started ? "LIVE" : "NS"),
          elapsed: m.status?.periodLength || null,
        },
      },
      league: {
        id: m.leagueId,
        name: m.tournamentStage || "Liga",
      },
      teams: {
        home: { id: m.home?.id, name: m.home?.name, logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${m.home?.id}.png` },
        away: { id: m.away?.id, name: m.away?.name, logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${m.away?.id}.png` },
      },
      goals: {
        home: m.home?.score ?? null,
        away: m.away?.score ?? null,
      },
    }));
  }

  // Standard API-Football v3
  const params: Record<string, string | number> = { date };
  if (leagueId) params.league = leagueId;
  const { data } = await api.get("fixtures", { params });
  return data.response || [];
}

/** Fetch a single fixture by id. */
export async function getFixtureById(id: number): Promise<any> {
  if (isFreeLiveFootballApi) {
    try {
      const { data } = await api.get("/football-get-match-detail", {
        params: { matchId: id },
      });
      return data?.response || null;
    } catch {
      return null;
    }
  }

  const { data } = await api.get("fixtures", { params: { id } });
  return data.response?.[0] || null;
}

/** Fetch all currently live fixtures. */
export async function getLiveFixtures(): Promise<any[]> {
  if (isFreeLiveFootballApi) {
    const { data } = await api.get("/football-current-live");
    const liveMatches = data?.response?.live || [];
    return liveMatches.map((m: any) => ({
      fixture: {
        id: m.id,
        date: m.status?.utcTime || new Date().toISOString(),
        status: {
          short: m.status?.reason?.short || "LIVE",
          elapsed: m.status?.elapsed || null,
        },
      },
      league: {
        id: m.leagueId,
        name: m.leagueName || "Liga",
      },
      teams: {
        home: { id: m.home?.id, name: m.home?.name, logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${m.home?.id}.png` },
        away: { id: m.away?.id, name: m.away?.name, logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${m.away?.id}.png` },
      },
      goals: {
        home: m.home?.score ?? 0,
        away: m.away?.score ?? 0,
      },
    }));
  }

  const { data } = await api.get("fixtures", { params: { live: "all" } });
  return data.response || [];
}

/** Fetch available leagues. */
export async function getLeagues(): Promise<any[]> {
  if (isFreeLiveFootballApi) {
    const { data } = await api.get("/football-get-all-leagues");
    const leagues = data?.response?.leagues || [];
    return leagues.map((l: any) => ({
      league: {
        id: l.id,
        name: l.name,
        type: "league",
        logo: l.logo || `https://images.fotmob.com/image_resources/logo/leaguelogo/dark/${l.id}.png`,
      },
      country: {
        name: l.ccode || "World",
      },
    }));
  }

  const { data } = await api.get("leagues");
  return data.response || [];
}

/** Fetch standings for a league. */
export async function getStandings(leagueId: number, season?: number): Promise<any[]> {
  if (isFreeLiveFootballApi) {
    const { data } = await api.get("/football-get-standing-all", {
      params: { leagueid: leagueId },
    });
    const standing = data?.response?.standing || [];
    return standing.map((s: any) => ({
      rank: s.idx,
      team: {
        id: s.id,
        name: s.name,
        logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${s.id}.png`,
      },
      points: s.pts,
      goalsDiff: s.goalConDiff,
      played: s.played,
      win: s.wins,
      draw: s.draws,
      lose: s.losses,
    }));
  }

  const { data } = await api.get("standings", { params: { league: leagueId, season: season || 2024 } });
  return data.response || [];
}

/** Fetch team information. */
export async function getTeam(id: number): Promise<any> {
  const { data } = await api.get("teams", { params: { id } });
  return data.response?.[0] || null;
}

/** Fetch player information. */
export async function getPlayer(id: number, season: number): Promise<any> {
  const { data } = await api.get("players", { params: { id, season } });
  return data.response?.[0] || null;
}
