/**
 * @file lib/football-api.ts
 * @description API-Football (v3) HTTP client.
 *
 * Wraps all external calls to `https://v3.football.api-sports.io`.
 * Every public function returns the `response` array from the API.
 */

import axios, { AxiosInstance } from "axios";

const apiKey = process.env.FOOTBALL_API_KEY ?? "";
const isRapidApi = apiKey.includes("msh") || process.env.FOOTBALL_API_HOST?.includes("rapidapi");
const host = process.env.FOOTBALL_API_HOST ?? (isRapidApi ? "api-football-v1.p.rapidapi.com" : "v3.football.api-sports.io");

/** Configured axios instance for API-Football (supports RapidAPI and API-Sports). */
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
/*  Generic helper                                                     */
/* ------------------------------------------------------------------ */

/**
 * Execute a GET request and return the `response` payload.
 * Throws on network / non-2xx errors.
 */
async function fetchData<T = unknown>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
): Promise<T[]> {
  const { data } = await api.get(endpoint, { params });

  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(
      `API-Football error: ${JSON.stringify(data.errors)}`,
    );
  }

  return data.response as T[];
}

/* ------------------------------------------------------------------ */
/*  Public functions                                                   */
/* ------------------------------------------------------------------ */

/**
 * Fetch fixtures for a given date (YYYY-MM-DD), optionally filtered by league.
 */
export async function getFixtures(date: string, leagueId?: number) {
  const params: Record<string, string | number> = { date };
  if (leagueId) params.league = leagueId;
  return fetchData("fixtures", params);
}

/** Fetch a single fixture by its API-Football id. */
export async function getFixtureById(id: number) {
  return fetchData("fixtures", { id });
}

/** Fetch all currently live fixtures. */
export async function getLiveFixtures() {
  return fetchData("fixtures", { live: "all" });
}

/** Fetch available leagues. */
export async function getLeagues() {
  return fetchData("leagues");
}

/** Fetch standings for a league and season. */
export async function getStandings(leagueId: number, season: number) {
  return fetchData("standings", { league: leagueId, season });
}

/** Fetch team information by API-Football team id. */
export async function getTeam(id: number) {
  return fetchData("teams", { id });
}

/** Fetch player information by API-Football player id and season. */
export async function getPlayer(id: number, season: number) {
  return fetchData("players", { id, season });
}

/** Fetch events (goals, cards, subs, VAR) for a fixture. */
export async function getFixtureEvents(id: number) {
  return fetchData("fixtures/events", { fixture: id });
}
