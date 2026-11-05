export function isLive(status: string): boolean {
  const liveStatuses = ["1H", "HT", "2H", "ET", "P", "LIVE", "BT"];
  return liveStatuses.includes(status);
}

export function isFinished(status: string): boolean {
  const finishedStatuses = ["FT", "AET", "PEN"];
  return finishedStatuses.includes(status);
}

export function isScheduled(status: string): boolean {
  const scheduledStatuses = ["NS", "TBD"];
  return scheduledStatuses.includes(status);
}

export function getStatusLabel(status: string, minute?: number | null): string {
  switch (status) {
    case "1H":
      return `1T • ${minute ?? 0}'`;
    case "2H":
      return `2T • ${minute ?? 45}'`;
    case "HT":
      return "INTERVALO";
    case "ET":
      return `PRORROG • ${minute ?? 90}'`;
    case "P":
      return "PÊNALTIS";
    case "FT":
      return "ENCERRADO";
    case "AET":
      return "FIM PRORR.";
    case "PEN":
      return "FIM PÊNALTIS";
    case "NS":
      return "NÃO INICIADO";
    case "PST":
      return "ADIADO";
    case "CANC":
      return "CANCELADO";
    case "SUSP":
      return "SUSPENSO";
    default:
      return status;
  }
}

export function getStatusColor(status: string): string {
  if (isLive(status)) return "#FF4444";
  if (isFinished(status)) return "#8B949E";
  return "#00C853";
}
