import { format, isToday as isDateToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatMatchTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "HH:mm");
  } catch {
    return "--:--";
  }
}

export function formatMatchDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function isToday(dateString: string): boolean {
  try {
    return isDateToday(parseISO(dateString));
  } catch {
    return false;
  }
}

export function getTodayDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}
