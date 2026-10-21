/**
 * Splits a keyword expression into include and exclude terms.
 */
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

/**
 * Wraps a term in double quotes when it contains a space.
 */
export const quote = (term: string): string =>
  term.includes(" ") ? `"${term}"` : term;

/**
 * Builds a keyword expression. In `or` mode, `||` joins the include terms.
 */
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
 * Validates a keyword expression.
 * Valid tokens: `+term`, `-term`, `+"phrase"`, `-"phrase"`.
 * Valid joiners: a space, or `||` between include terms.
 */
export const validate = (input: string): boolean => {
  const trimmed = input.trim();
  if (!trimmed) return false;

  const orSegments = trimmed.split(/\s*\|\|\s*/);

  for (const segment of orSegments) {
    if (!segment.trim()) return false;

    const tokenRegex =
      /^[+-](?:"[^"]+"|[a-z0-9]\S*)(?:\s+[+-](?:"[^"]+"|[a-z0-9]\S*))*$/i;
    if (!tokenRegex.test(segment.trim())) return false;
  }

  if (/(?<!\|)\|(?!\|)/.test(trimmed)) return false;

  return true;
};
