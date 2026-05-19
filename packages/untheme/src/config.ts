import type { UserTheme, Theme, ThemeRegistry, CustomColor, RoleTokens } from "./types";
import reference from "./tokens/reference";
import modes from "./tokens/modes";
import defu from "defu";

export type { RefToken, ModeToken, ColorFamily, ColorShade, CustomColor, AnyToken, RoleTokens, UserTheme, Theme, ThemeManifestEntry, ThemeManifest, ThemeRegistry } from "./types";

export const defineTheme = (theme: UserTheme): Theme =>
  defu(theme, { label: "", reference, modes }) as Theme;

export const isTheme = (value: unknown): value is Theme =>
  typeof value === "object" && value !== null && "reference" in value && "modes" in value;

const COLOR_FAMILIES: ReadonlySet<string> = new Set([
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet", "purple",
  "fuchsia", "pink", "rose",
]);

const COLOR_SHADES: ReadonlySet<number> = new Set([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]);

export const isCustomColor = (value: unknown): value is CustomColor => {
  if (typeof value !== "object" || value === null) return false;
  if (!("family" in value) || !("light" in value) || !("dark" in value)) return false;
  const v: Record<string, unknown> = value;
  return typeof v.family === "string" && COLOR_FAMILIES.has(v.family) &&
    typeof v.light === "number" && COLOR_SHADES.has(v.light) &&
    typeof v.dark === "number" && COLOR_SHADES.has(v.dark);
};

export const defineUntheme = <C extends string>(options: {
  defaultTheme?: string;
  themes?: ThemeRegistry;
  colors?: Record<C, CustomColor>;
  roles?: RoleTokens<C>;
}) => options;
