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

export interface IconData {
  uri: string;
  mode: string;
}

// Encode SVG to DataURI (UTF-8 encoding, more efficient than base64 for SVGs)
function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Detect if SVG uses currentColor (monochrome) or has embedded colors
function detectMode(body: string): "mask" | "background" {
  return body.includes("currentColor") ? "mask" : "mask";
}

// Generic defineIconic function
export function defineIconic<T extends IconifyJSON>(
  iconSet: T,
  aliases: Record<string, keyof T["icons"] & string>,
): Record<string, IconData> {
  const result: Record<string, IconData> = {};

  for (const [alias, iconName] of Object.entries(aliases)) {
    const icon = iconSet.icons[iconName];
    if (icon) {
      const width = icon.width ?? 24;
      const height = icon.height ?? 24;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${icon.body}</svg>`;
      const mode = detectMode(icon.body);

      result[alias] = {
        uri: svgToDataUri(svg),
        mode,
      } satisfies IconData;
    }
  }

  return result;
}
