export interface League {
  id: number;
  name: string;
  country: string;
  flag: string;
}

export const popularLeagues: League[] = [
  { id: 71, name: "Brasileirão Série A", country: "Brasil", flag: "🇧🇷" },
  { id: 72, name: "Brasileirão Série B", country: "Brasil", flag: "🇧🇷" },
  { id: 39, name: "Premier League", country: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 140, name: "La Liga", country: "Espanha", flag: "🇪🇸" },
  { id: 135, name: "Serie A", country: "Itália", flag: "🇮🇹" },
  { id: 78, name: "Bundesliga", country: "Alemanha", flag: "🇩🇪" },
  { id: 61, name: "Ligue 1", country: "França", flag: "🇫🇷" },
  { id: 94, name: "Primeira Liga", country: "Portugal", flag: "🇵🇹" },
  { id: 88, name: "Eredivisie", country: "Holanda", flag: "🇳🇱" },
  { id: 2, name: "Champions League", country: "Europa", flag: "🇪🇺" },
  { id: 3, name: "Europa League", country: "Europa", flag: "🇪🇺" },
  { id: 13, name: "Copa Libertadores", country: "América do Sul", flag: "🌎" },
  { id: 11, name: "Copa Sul-Americana", country: "América do Sul", flag: "🌎" },
  { id: 1, name: "Copa do Mundo", country: "Internacional", flag: "🏆" },
  { id: 128, name: "Copa Argentina", country: "Argentina", flag: "🇦🇷" },
  { id: 253, name: "Major League Soccer", country: "EUA", flag: "🇺🇸" },
];

export const allLeagues: League[] = [
  ...popularLeagues,
  { id: 73, name: "Copa do Brasil", country: "Brasil", flag: "🇧🇷" },
  { id: 75, name: "Brasileirão Série C", country: "Brasil", flag: "🇧🇷" },
  { id: 76, name: "Brasileirão Série D", country: "Brasil", flag: "🇧🇷" },
  { id: 40, name: "Championship", country: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 141, name: "La Liga 2", country: "Espanha", flag: "🇪🇸" },
  { id: 136, name: "Serie B", country: "Itália", flag: "🇮🇹" },
  { id: 79, name: "2. Bundesliga", country: "Alemanha", flag: "🇩🇪" },
  { id: 62, name: "Ligue 2", country: "França", flag: "🇫🇷" },
  { id: 128, name: "Liga Profesional", country: "Argentina", flag: "🇦🇷" },
  { id: 262, name: "Liga MX", country: "México", flag: "🇲🇽" },
  { id: 307, name: "Saudi Pro League", country: "Arábia Saudita", flag: "🇸🇦" },
  { id: 4, name: "Conference League", country: "Europa", flag: "🇪🇺" },
  { id: 15, name: "Copa América", country: "América do Sul", flag: "🌎" },
  { id: 5, name: "Nations League", country: "Europa", flag: "🇪🇺" },
];
