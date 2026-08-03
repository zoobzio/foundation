export const parse = (kw: string): { include: string[]; exclude: string[] } => {
  if (!kw.trim()) return { include: [], exclude: [] };
  const include: string[] = [];
  const exclude: string[] = [];
  const cleaned = kw.replace(/\|\|/g, " ");
  const regex = /([+-])(?:"([^"]+)"|([^\s"+-]\S*))/g;
  let m;
  while ((m = regex.exec(cleaned)) !== null) {
    const prefix = m[1];
    const term = (m[2] ?? m[3])!;
    if (prefix === "-") exclude.push(term);
    else include.push(term);
  }
  return { include, exclude };
};

export const quote = (term: string): string =>
  term.includes(" ") ? `"${term}"` : term;

export const build = (
  include: string[],
  exclude: string[],
  mode: "and" | "or",
): string => {
  const parts: string[] = [];
  if (include.length) {
    const joiner = mode === "or" ? " || " : " ";
    parts.push(include.map((t) => `+${quote(t)}`).join(joiner));
  }
  if (exclude.length) {
    parts.push(exclude.map((t) => `-${quote(t)}`).join(" "));
  }
  return parts.join(" ");
};

/**
 * Validates a keyword string against our supported Lucene subset.
 *
 * Valid tokens:
 *   +term, -term, +"quoted phrase", -"quoted phrase"
 *
 * Valid joiners:
 *   space (AND), || (OR, between include terms only)
 *
 * Invalid:
 *   bare terms without +/-, single |, OR/AND text operators
 */
export const validate = (input: string): boolean => {
  const trimmed = input.trim();
  if (!trimmed) return false;

  // Split on || first, then validate each segment
  const orSegments = trimmed.split(/\s*\|\|\s*/);

  for (const segment of orSegments) {
    if (!segment.trim()) return false;

    // Each segment must be valid terms separated by spaces
    // Match: +term, -term, +"quoted", -"quoted"
    // Term must start with a word character (no double prefix like --foo or +-foo)
    const tokenRegex =
      /^[+-](?:"[^"]+"|[a-z0-9]\S*)(?:\s+[+-](?:"[^"]+"|[a-z0-9]\S*))*$/i;
    if (!tokenRegex.test(segment.trim())) return false;
  }

  // Ensure no single | (must be ||)
  if (/(?<!\|)\|(?!\|)/.test(trimmed)) return false;

  return true;
};
