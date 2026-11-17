const CYRILLIC_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  ғ: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "j",
  з: "z",
  и: "i",
  і: "i",
  й: "y",
  к: "k",
  қ: "q",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  ў: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ӯ: "u",
  ф: "f",
  х: "x",
  ҳ: "h",
  ц: "ts",
  ч: "ch",
  ҷ: "j",
  ш: "sh",
  щ: "sh",
  ъ: "",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join("")
    .replace(/['’ʻʼ`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export async function ensureUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const seed = slugify(base) || "item";
  let slug = seed;
  let suffix = 1;
  while (await exists(slug)) {
    suffix += 1;
    slug = `${seed}-${suffix}`;
  }
  return slug;
}
