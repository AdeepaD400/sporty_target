export const SPORT_COLORS = [
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0891b2",
  "#4f46e5",
  "#be123c",
] as const;

export function pickSportColor(usedColors: string[]): string {
  const available = SPORT_COLORS.find((c) => !usedColors.includes(c));
  return available ?? SPORT_COLORS[usedColors.length % SPORT_COLORS.length];
}
