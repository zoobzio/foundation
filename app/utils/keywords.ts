const parse = (kw: string): { include: string[]; exclude: string[] } => {
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

const quote = (term: string): string =>
  term.includes(" ") ? `"${term}"` : term;

const build = (include: string[], exclude: string[], mode: "and" | "or"): string => {
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

export const Keywords = { parse, quote, build };
