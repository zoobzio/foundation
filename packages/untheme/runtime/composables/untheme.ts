import type { Untheme, Tokens } from "@foundation/untheme/config";

import { accessUnthemeStore } from "../stores/untheme";
import { keys } from "../utils/untheme";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export const useUntheme = () => {
  const store = accessUnthemeStore();
  const { mode, theme, tokens } = storeToRefs(store);
  return {
    mode,
    theme,
    tokens,
    setMode: store.setMode,
    setTheme: store.setTheme,
    resolve: store.resolve,
  };
};

export const useTokenStyle = <T extends keyof Untheme["roles"]>(
  tokens?: Tokens<T>,
) => {
  const store = accessUnthemeStore();

  return computed(() => {
    const styles = {} as { [K in T]: Record<string, string> };

    if (!tokens) return styles;

    keys(tokens).forEach((role) => {
      const roleTokens = tokens[role];
      if (!roleTokens) return;

      const roleStyles: Record<string, string> = {};

      keys(roleTokens).forEach((tokenKey) => {
        const value = roleTokens[tokenKey];
        if (value && store.isToken(value)) {
          roleStyles[`--${role}-${String(tokenKey)}`] = store.resolve(value);
        }
      });

      styles[role] = roleStyles;
    });

    return styles;
  });
};
