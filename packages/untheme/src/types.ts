import type reference from "./tokens/reference";
import type modes from "./tokens/modes";

export type RefToken = keyof typeof reference;
export type ModeToken = keyof typeof modes.light;

export type ColorFamily =
  | "slate" | "gray" | "zinc" | "neutral" | "stone"
  | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald"
  | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple"
  | "fuchsia" | "pink" | "rose";

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type CustomColor = {
  family: ColorFamily;
  light: ColorShade;
  dark: ColorShade;
};

export type AnyToken<C extends string = never> = RefToken | ModeToken | `clr-${C}`;
export type RoleTokens<C extends string = never> = Record<string, AnyToken<C>>;

export type UserTheme = {
  label?: string;
  reference?: {
    [R in keyof typeof reference]?: string;
  };
  modes?: {
    light?: {
      [M in ModeToken]?: RefToken;
    };
    dark?: {
      [M in ModeToken]?: RefToken;
    };
  };
};

export type Theme = {
  label: string;
  reference: {
    [R in keyof typeof reference]: string;
  };
  modes: {
    light: {
      [M in ModeToken]: RefToken;
    };
    dark: {
      [M in ModeToken]: RefToken;
    };
  };
};

export type ThemeManifestEntry = { key: string; label: string };
export type ThemeManifest = ThemeManifestEntry[];

export type ThemeRegistry = Record<string, Theme>;
