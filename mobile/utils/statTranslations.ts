/**
 * @file utils/statTranslations.ts
 * @description Translate SofaScore / FootApi statistics terms to Portuguese (PT-BR).
 */

export const STAT_TRANSLATIONS: Record<string, string> = {
  "Ball possession": "Posse de Bola",
  "Expected goals": "Gols Esperados (xG)",
  "Total shots": "Finalizações",
  "Shots on target": "Chutes no Gol",
  "Shots off target": "Chutes para Fora",
  "Blocked shots": "Chutes Bloqueados",
  "Corner kicks": "Escanteios",
  "Offsides": "Impedimentos",
  "Fouls": "Faltas",
  "Yellow cards": "Cartões Amarelos",
  "Red cards": "Cartões Vermelhos",
  "Free kicks": "Faltas Recebidas",
  "Throw-ins": "Laterais",
  "Goal kicks": "Tiros de Meta",
  "Big chances": "Grandes Chances",
  "Big chances missed": "Grandes Chances Perdidas",
  "Goalkeeper saves": "Defesas do Goleiro",
  "Total passes": "Passes Totais",
  "Accurate passes": "Passes Certos",
  "Passes %": "Precisão de Passes",
  "Tackles": "Desarmes",
  "Interceptions": "Interceptações",
  "Clearances": "Cortes",
  "Hit woodwork": "Bolas na Trave",
  "Shots inside box": "Finalizações na Área",
  "Shots outside box": "Finalizações de Fora",
};

export function translateStatName(name: string): string {
  return STAT_TRANSLATIONS[name] || name;
}
