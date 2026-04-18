import reference from "./tokens/reference";
import modes from "./tokens/modes";

import defu from "defu";

export type RefToken = keyof typeof reference;
export type ModeToken = keyof typeof modes.light;

export type UserTheme = {
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

export type ThemeRegistry = Record<string, Theme>;

export const defineTheme = (theme: UserTheme): Theme =>
  defu(theme, { reference, modes }) as Theme;
