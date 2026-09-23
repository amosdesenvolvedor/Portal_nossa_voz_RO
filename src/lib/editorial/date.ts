const DEFAULT_LOCALE = "pt-BR";
const DEFAULT_TIME_ZONE = "America/Porto_Velho";

function toDate(input: string | Date): Date | null {
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input;
  }

  const date = new Date(input);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatEditorialDateLabel(input: string | Date, locale = DEFAULT_LOCALE): string {
  const date = toDate(input);

  if (!date) {
    return "Data indisponivel";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: DEFAULT_TIME_ZONE,
  }).format(date);
}

export function formatEditorialTimeLabel(input: string | Date, locale = DEFAULT_LOCALE): string {
  const date = toDate(input);

  if (!date) {
    return "--:--";
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: DEFAULT_TIME_ZONE,
  }).format(date);
}

export function formatEditorialDateTimeLabel(input: string | Date, locale = DEFAULT_LOCALE): string {
  const dateLabel = formatEditorialDateLabel(input, locale);
  const timeLabel = formatEditorialTimeLabel(input, locale);

  if (dateLabel === "Data indisponivel" || timeLabel === "--:--") {
    return "Data indisponivel";
  }

  return `${dateLabel} • ${timeLabel}`;
}