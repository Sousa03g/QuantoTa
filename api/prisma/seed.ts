import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LEAGUES = [
  { externalId: 71, name: "Brasileirão Série A", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/71.png", type: "league", season: 2024 },
  { externalId: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", type: "league", season: 2024 },
  { externalId: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", type: "league", season: 2024 },
  { externalId: 135, name: "Serie A", country: "Italy", logo: "https://media.api-sports.io/football/leagues/135.png", type: "league", season: 2024 },
  { externalId: 78, name: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png", type: "league", season: 2024 },
  { externalId: 61, name: "Ligue 1", country: "France", logo: "https://media.api-sports.io/football/leagues/61.png", type: "league", season: 2024 },
  { externalId: 2, name: "UEFA Champions League", country: "World", logo: "https://media.api-sports.io/football/leagues/2.png", type: "cup", season: 2024 },
  { externalId: 13, name: "Copa Libertadores", country: "South America", logo: "https://media.api-sports.io/football/leagues/13.png", type: "cup", season: 2024 },
  { externalId: 73, name: "Copa do Brasil", country: "Brazil", logo: "https://media.api-sports.io/football/leagues/73.png", type: "cup", season: 2024 },
];

const TEAMS = [
  { externalId: 127, name: "Flamengo", shortName: "FLA", logo: "https://media.api-sports.io/football/teams/127.png", country: "Brazil", founded: 1895, venue: "Maracanã" },
  { externalId: 131, name: "Corinthians", shortName: "COR", logo: "https://media.api-sports.io/football/teams/131.png", country: "Brazil", founded: 1910, venue: "Neo Química Arena" },
  { externalId: 121, name: "Palmeiras", shortName: "PAL", logo: "https://media.api-sports.io/football/teams/121.png", country: "Brazil", founded: 1914, venue: "Allianz Parque" },
  { externalId: 126, name: "São Paulo", shortName: "SAO", logo: "https://media.api-sports.io/football/teams/126.png", country: "Brazil", founded: 1930, venue: "MorumBIS" },
  { externalId: 529, name: "Barcelona", shortName: "BAR", logo: "https://media.api-sports.io/football/teams/529.png", country: "Spain", founded: 1899, venue: "Camp Nou" },
  { externalId: 541, name: "Real Madrid", shortName: "RMA", logo: "https://media.api-sports.io/football/teams/541.png", country: "Spain", founded: 1902, venue: "Santiago Bernabéu" },
  { externalId: 33, name: "Manchester United", shortName: "MUN", logo: "https://media.api-sports.io/football/teams/33.png", country: "England", founded: 1878, venue: "Old Trafford" },
  { externalId: 49, name: "Chelsea", shortName: "CHE", logo: "https://media.api-sports.io/football/teams/49.png", country: "England", founded: 1905, venue: "Stamford Bridge" },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const league of LEAGUES) {
    await prisma.league.upsert({
      where: { externalId: league.externalId },
      update: league,
      create: league,
    });
  }
  console.log(`✅ Seeded ${LEAGUES.length} leagues`);

  for (const team of TEAMS) {
    await prisma.team.upsert({
      where: { externalId: team.externalId },
      update: team,
      create: team,
    });
  }
  console.log(`✅ Seeded ${TEAMS.length} teams`);

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
