// Generic iconify JSON interface
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

// Generic defineIconic function
export function defineIconic<T extends IconifyJSON>(
  iconSet: T,
  aliases: Record<string, keyof T["icons"] & string>,
) {
  const result: Record<string, string> = {};

  for (const [alias, iconName] of Object.entries(aliases)) {
    const icon = iconSet.icons[iconName];
    if (icon) {
      result[alias] = icon.body;
    }
  }

  return result;
}
