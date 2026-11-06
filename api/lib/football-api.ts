/**
 * @file lib/football-api.ts
 * @description Universal Football API Client.
 * Supports:
 * 1. RapidAPI "FootApi7" (footapi7.p.rapidapi.com - Real-time SofaScore data)
 * 2. RapidAPI "API-Football v3" (api-football-v1.p.rapidapi.com)
 * 3. Direct API-Sports (v3.football.api-sports.io)
 * 4. RapidAPI "Free API Live Football Data" (free-api-live-football-data.p.rapidapi.com)
 */

import axios, { AxiosInstance } from "axios";

const apiKey = process.env.FOOTBALL_API_KEY ?? "045970736amshc0b565387a60a2ep1367bfjsna964020bd4c9";
const host = process.env.FOOTBALL_API_HOST ?? "footapi7.p.rapidapi.com";

const isFootApi = host.includes("footapi");
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
/*  Internal in-memory cache to respect rate limits (429 prevention)   */
/* ------------------------------------------------------------------ */
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const memoryCache = new Map<string, CacheEntry<any>>();

function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setInCache<T>(key: string, data: T, ttlSeconds: number): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/* ------------------------------------------------------------------ */
/*  Public functions                                                  */
/* ------------------------------------------------------------------ */

/**
 * Fetch all currently live fixtures.
 */
export async function getLiveFixtures(): Promise<any[]> {
  const cacheKey = "fixtures:live";
  const cached = getFromCache<any[]>(cacheKey);
  if (cached) return cached;

  // 1. FootApi7 (SofaScore real-time live matches)
  if (isFootApi) {
    try {
      const { data } = await api.get("/api/matches/live");
      const events: any[] = data?.events || [];

      const normalized = events.map((event: any) => {
        let elapsed: number | null = null;
        if (event.statusTime?.timestamp) {
          elapsed = Math.min(90, Math.max(1, Math.floor((Date.now() / 1000 - event.statusTime.timestamp) / 60)));
        } else if (event.time?.initial) {
          elapsed = Math.floor(event.time.initial / 60);
        }

        const leagueId = event.tournament?.uniqueTournament?.id || event.tournament?.id || 0;
        const leagueName = event.tournament?.uniqueTournament?.name || event.tournament?.name || "Liga";
        const country = event.tournament?.category?.name || "Mundo";
        const leagueLogo = `https://img.sofascore.com/api/v1/unique-tournament/${leagueId}/image`;

        const homeId = event.homeTeam?.id || 0;
        const awayId = event.awayTeam?.id || 0;

        return {
          id: event.id,
          externalId: event.id,
          leagueId,
          homeTeam: {
            id: homeId,
            externalId: homeId,
            name: event.homeTeam?.name || "Time Casa",
            shortName: event.homeTeam?.shortName || event.homeTeam?.name,
            logo: `https://img.sofascore.com/api/v1/team/${homeId}/image`,
          },
          awayTeam: {
            id: awayId,
            externalId: awayId,
            name: event.awayTeam?.name || "Time Visitante",
            shortName: event.awayTeam?.shortName || event.awayTeam?.name,
            logo: `https://img.sofascore.com/api/v1/team/${awayId}/image`,
          },
          homeScore: event.homeScore?.display ?? event.homeScore?.current ?? 0,
          awayScore: event.awayScore?.display ?? event.awayScore?.current ?? 0,
          status: event.status?.description || (event.status?.type === "inprogress" ? "LIVE" : event.status?.type === "finished" ? "FT" : "NS"),
          date: new Date((event.startTimestamp || Date.now() / 1000) * 1000).toISOString(),
          minute: elapsed,
          league: {
            id: leagueId,
            name: leagueName,
            country,
            logo: leagueLogo,
          },
          // Standard API-Football compat shape
          fixture: {
            id: event.id,
            date: new Date((event.startTimestamp || Date.now() / 1000) * 1000).toISOString(),
            status: {
              short: event.status?.description || "LIVE",
              elapsed,
            },
          },
          teams: {
            home: { id: homeId, name: event.homeTeam?.name, logo: `https://img.sofascore.com/api/v1/team/${homeId}/image` },
            away: { id: awayId, name: event.awayTeam?.name, logo: `https://img.sofascore.com/api/v1/team/${awayId}/image` },
          },
          goals: {
            home: event.homeScore?.display ?? event.homeScore?.current ?? 0,
            away: event.awayScore?.display ?? event.awayScore?.current ?? 0,
          },
        };
      });

      setInCache(cacheKey, normalized, 15); // 15 seconds cache
      return normalized;
    } catch (err: any) {
      console.error("[FootApi] Error fetching live matches:", err.message);
      return [];
    }
  }

  // 2. Free API Live Football Data
  if (isFreeLiveFootballApi) {
    try {
      const { data } = await api.get("/football-current-live");
      const liveMatches = data?.response?.live || [];
      const normalized = liveMatches.map((m: any) => ({
        id: m.id,
        externalId: m.id,
        leagueId: m.leagueId,
        homeTeam: { id: m.home?.id, name: m.home?.name, logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${m.home?.id}.png` },
        awayTeam: { id: m.away?.id, name: m.away?.name, logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${m.away?.id}.png` },
        homeScore: m.home?.score ?? 0,
        awayScore: m.away?.score ?? 0,
        status: m.status?.reason?.short || "LIVE",
        date: m.status?.utcTime || new Date().toISOString(),
        minute: m.status?.periodLength || null,
        league: { id: m.leagueId, name: m.tournamentStage || "Liga", country: "World", logo: "" },
        fixture: { id: m.id, date: m.status?.utcTime || new Date().toISOString(), status: { short: m.status?.reason?.short || "LIVE", elapsed: null } },
        teams: { home: { id: m.home?.id, name: m.home?.name, logo: "" }, away: { id: m.away?.id, name: m.away?.name, logo: "" } },
        goals: { home: m.home?.score ?? 0, away: m.away?.score ?? 0 },
      }));
      setInCache(cacheKey, normalized, 30);
      return normalized;
    } catch {
      return [];
    }
  }

  // 3. API-Football v3
  const { data } = await api.get("fixtures", { params: { live: "all" } });
  const result = data.response || [];
  setInCache(cacheKey, result, 30);
  return result;
}

/**
 * Fetch fixtures for a given date (YYYY-MM-DD), optionally filtered by league.
 */
export async function getFixtures(date: string, leagueId?: number): Promise<any[]> {
  const cacheKey = `fixtures:${date}:${leagueId || "all"}`;
  const cached = getFromCache<any[]>(cacheKey);
  if (cached) return cached;

  if (isFootApi) {
    // For FootApi, live matches are the main dynamic source.
    const live = await getLiveFixtures();
    setInCache(cacheKey, live, 30);
    return live;
  }

  if (isFreeLiveFootballApi) {
    const cleanDate = date.replace(/-/g, "");
    try {
      const { data } = await api.get("/football-get-matches-by-date", {
        params: { date: cleanDate },
      });
      const matches = data?.response?.matches || [];
      const normalized = matches.map((m: any) => ({
        id: m.id,
        externalId: m.id,
        leagueId: m.leagueId,
        homeTeam: { id: m.home?.id, name: m.home?.name, logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${m.home?.id}.png` },
        awayTeam: { id: m.away?.id, name: m.away?.name, logo: `https://images.fotmob.com/image_resources/logo/teamlogo/${m.away?.id}.png` },
        homeScore: m.home?.score ?? null,
        awayScore: m.away?.score ?? null,
        status: m.status?.reason?.short || (m.status?.finished ? "FT" : m.status?.started ? "LIVE" : "NS"),
        date: m.status?.utcTime || new Date(m.timeTS || Date.now()).toISOString(),
        minute: m.status?.periodLength || null,
        league: { id: m.leagueId, name: m.tournamentStage || "Liga", country: "World", logo: "" },
        fixture: { id: m.id, date: m.status?.utcTime || new Date().toISOString(), status: { short: m.status?.finished ? "FT" : "NS", elapsed: null } },
        teams: { home: { id: m.home?.id, name: m.home?.name, logo: "" }, away: { id: m.away?.id, name: m.away?.name, logo: "" } },
        goals: { home: m.home?.score ?? null, away: m.away?.score ?? null },
      }));
      setInCache(cacheKey, normalized, 60);
      return normalized;
    } catch {
      return [];
    }
  }

  // API-Football v3
  const params: Record<string, string | number> = { date };
  if (leagueId) params.league = leagueId;
  const { data } = await api.get("fixtures", { params });
  const result = data.response || [];
  setInCache(cacheKey, result, 60);
  return result;
}

/**
 * Fetch a single fixture by id.
 */
export async function getFixtureById(id: number): Promise<any> {
  const cacheKey = `fixture:${id}`;
  const cached = getFromCache<any>(cacheKey);
  if (cached) return cached;

  if (isFootApi) {
    try {
      const { data: matchData } = await api.get(`/api/match/${id}`);
      const event = matchData?.event;
      if (!event) return null;

      // Also fetch incidents (goals, cards, substitutions)
      let events: any[] = [];
      try {
        const { data: incData } = await api.get(`/api/match/${id}/incidents`);
        const incidents: any[] = incData?.incidents || [];
        events = incidents.map((inc: any, idx: number) => ({
          id: inc.id || idx,
          minute: inc.time || 0,
          type: inc.incidentType === "goal" ? "Goal" : inc.incidentType === "card" ? "Card" : inc.incidentType === "substitution" ? "subst" : inc.incidentType || "Event",
          playerName: inc.player?.name || inc.playerIn?.name || inc.playerOut?.name || undefined,
          detail: inc.text || (inc.playerIn && inc.playerOut ? `Sai: ${inc.playerOut.name} -> Entra: ${inc.playerIn.name}` : undefined),
        }));
      } catch {
        // Incidents optional
      }

      const homeId = event.homeTeam?.id || 0;
      const awayId = event.awayTeam?.id || 0;
      const leagueId = event.tournament?.uniqueTournament?.id || event.tournament?.id || 0;

      const normalized = {
        id: event.id,
        externalId: event.id,
        leagueId,
        homeTeam: {
          id: homeId,
          externalId: homeId,
          name: event.homeTeam?.name || "Time Casa",
          shortName: event.homeTeam?.shortName,
          logo: `https://img.sofascore.com/api/v1/team/${homeId}/image`,
        },
        awayTeam: {
          id: awayId,
          externalId: awayId,
          name: event.awayTeam?.name || "Time Visitante",
          shortName: event.awayTeam?.shortName,
          logo: `https://img.sofascore.com/api/v1/team/${awayId}/image`,
        },
        homeScore: event.homeScore?.display ?? event.homeScore?.current ?? null,
        awayScore: event.awayScore?.display ?? event.awayScore?.current ?? null,
        status: event.status?.description || (event.status?.type === "inprogress" ? "LIVE" : "FT"),
        date: new Date((event.startTimestamp || Date.now() / 1000) * 1000).toISOString(),
        minute: event.statusTime?.initial ? Math.floor(event.statusTime.initial / 60) : null,
        venue: event.venue?.name,
        events,
        league: {
          id: leagueId,
          name: event.tournament?.uniqueTournament?.name || event.tournament?.name || "Liga",
          country: event.tournament?.category?.name || "Mundo",
          logo: `https://img.sofascore.com/api/v1/unique-tournament/${leagueId}/image`,
        },
      };

      setInCache(cacheKey, normalized, 30);
      return normalized;
    } catch (err: any) {
      console.error("[FootApi] Error fetching match detail:", err.message);
      return null;
    }
  }

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

/** Fetch available leagues. */
export async function getLeagues(): Promise<any[]> {
  const cacheKey = "leagues:all";
  const cached = getFromCache<any[]>(cacheKey);
  if (cached) return cached;

  if (isFootApi) {
    // Return popular supported leagues
    const popular = [
      { league: { id: 325, name: "Brasileirão Série A", country: "Brasil", logo: "https://img.sofascore.com/api/v1/unique-tournament/325/image" } },
      { league: { id: 390, name: "Brasileirão Série B", country: "Brasil", logo: "https://img.sofascore.com/api/v1/unique-tournament/390/image" } },
      { league: { id: 373, name: "Copa do Brasil", country: "Brasil", logo: "https://img.sofascore.com/api/v1/unique-tournament/373/image" } },
      { league: { id: 384, name: "Copa Libertadores", country: "América do Sul", logo: "https://img.sofascore.com/api/v1/unique-tournament/384/image" } },
      { league: { id: 7, name: "UEFA Champions League", country: "Europa", logo: "https://img.sofascore.com/api/v1/unique-tournament/7/image" } },
      { league: { id: 17, name: "Premier League", country: "Inglaterra", logo: "https://img.sofascore.com/api/v1/unique-tournament/17/image" } },
      { league: { id: 8, name: "La Liga", country: "Espanha", logo: "https://img.sofascore.com/api/v1/unique-tournament/8/image" } },
    ];
    setInCache(cacheKey, popular, 3600);
    return popular;
  }

  const { data } = await api.get("leagues");
  return data.response || [];
}

/** Fetch standings for a league. */
export async function getStandings(leagueId: number, season?: number): Promise<any[]> {
  const cacheKey = `standings:${leagueId}`;
  const cached = getFromCache<any[]>(cacheKey);
  if (cached) return cached;

  if (isFootApi) {
    try {
      const { data } = await api.get(`/api/tournament/${leagueId}/standings/total`);
      const rows = data?.standings?.[0]?.rows || [];
      const normalized = rows.map((r: any) => ({
        rank: r.position,
        team: {
          id: r.team?.id,
          name: r.team?.name,
          logo: `https://img.sofascore.com/api/v1/team/${r.team?.id}/image`,
        },
        points: r.points,
        goalsDiff: (r.scoresFor || 0) - (r.scoresAgainst || 0),
        played: r.matches,
        win: r.wins,
        draw: r.draws,
        lose: r.losses,
      }));
      setInCache(cacheKey, normalized, 300);
      return normalized;
    } catch {
      return [];
    }
  }

  const { data } = await api.get("standings", { params: { league: leagueId, season: season || 2024 } });
  return data.response || [];
}

/** Fetch team information. */
export async function getTeam(id: number): Promise<any> {
  const cacheKey = `team:${id}`;
  const cached = getFromCache<any>(cacheKey);
  if (cached) return cached;

  if (isFootApi) {
    try {
      const { data } = await api.get(`/api/team/${id}`);
      const team = data?.team;
      if (!team) return null;
      const normalized = {
        team: {
          id: team.id,
          name: team.name,
          shortName: team.shortName,
          logo: `https://img.sofascore.com/api/v1/team/${team.id}/image`,
          country: team.country?.name,
          founded: team.foundationDateTimestamp ? new Date(team.foundationDateTimestamp * 1000).getFullYear() : null,
        },
      };
      setInCache(cacheKey, normalized, 3600);
      return normalized;
    } catch {
      return null;
    }
  }

  const { data } = await api.get("teams", { params: { id } });
  return data.response?.[0] || null;
}

/** Fetch player information. */
export async function getPlayer(id: number, season: number): Promise<any> {
  const { data } = await api.get("players", { params: { id, season } });
  return data.response?.[0] || null;
}
