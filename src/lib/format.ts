const UZ_MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

export function formatDateUz(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()}-yil`;
}

export function excerpt(text: string, max = 180): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => (word[0] ?? "").toUpperCase())
    .join("");
}
