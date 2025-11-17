import type {
  Untheme,
  UnthemeConfig,
  Token,
  RoleToken,
} from "../../src/config";

// @ts-expect-error only available at runtime within a module
import theme from "#build/untheme.config.mjs";
import defu from "defu";

import { computed } from "vue";
import { useState, useCookie } from "#app";
import { tokenize, keys } from "../utils/untheme";

export interface UnthemeState {
  mode: "light" | "dark";
  theme: Untheme;
}

export const accessUnthemeStore = () => {
  const mode = useCookie<"light" | "dark">("untheme-mode", { default: () => "dark" });
  const themeState = useState<Untheme>("untheme-theme", () => ({ ...theme }));

  const tokens = computed<Record<Token, string>>(() => {
    const roles = keys(themeState.value.roles);
    const roleTokens = roles.reduce(
      (tokens, role) => {
        const roleAttrs = keys(themeState.value.roles[role]);

        roleAttrs.forEach((attr) => {
          const key = tokenize(role, attr);
          tokens[key] = themeState.value.roles[role][attr];
        });

        return tokens;
      },
      {} as Record<RoleToken, string>,
    );
    return {
      ...themeState.value.reference,
      ...themeState.value.modes[mode.value],
      ...roleTokens,
    };
  });

  const setMode = (newMode: "light" | "dark") => {
    mode.value = newMode;
  };

  const setTheme = (newTheme: UnthemeConfig) => {
    themeState.value = defu<Untheme, [Untheme]>(newTheme, themeState.value);
  };

  const isToken = (value: unknown): value is Token => {
    return typeof value === "string" && value in tokens.value;
  };

  const resolve = (token: Token): string => {
    const value = tokens.value[token];
    return isToken(value) ? resolve(value) : value;
  };

  return {
    mode,
    theme: themeState,
    tokens,
    setMode,
    setTheme,
    isToken,
    resolve,
  };
};
