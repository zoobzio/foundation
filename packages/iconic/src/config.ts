export interface IconifyJSON {
  prefix: string;
  icons: Record<
    string,
    {
      body: string;
      width?: number;
      height?: number;
    }
  >;
}

export interface IconEntry {
  viewBox: string;
}

export interface IconicResult {
  entries: Record<string, IconEntry>;
  symbols: string;
}

export function defineIconic<T extends IconifyJSON>(
  iconSet: T,
  aliases: Record<string, keyof T["icons"] & string>,
): IconicResult {
  const entries: Record<string, IconEntry> = {};
  const symbols: string[] = [];

  for (const [alias, iconName] of Object.entries(aliases)) {
    const icon = iconSet.icons[iconName];
    if (icon) {
      const width = icon.width ?? 24;
      const height = icon.height ?? 24;
      const viewBox = `0 0 ${width} ${height}`;

      entries[alias] = { viewBox };
      symbols.push(`<symbol id="${alias}" viewBox="${viewBox}">${icon.body}</symbol>`);
    }
  }

  return { entries, symbols: symbols.join("\n") };
}

export function mergeIconic(...results: IconicResult[]): {
  entries: Record<string, IconEntry>;
  sprite: string;
} {
  const entries: Record<string, IconEntry> = {};
  const symbols: string[] = [];

  for (const result of results) {
    Object.assign(entries, result.entries);
    symbols.push(result.symbols);
  }

  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join("\n")}\n</svg>`;

  return { entries, sprite };
}
