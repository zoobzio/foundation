// @ts-ignore only available at runtime within a module
import config from "#build/untheme.config.mjs";
import defu from "defu";

import { useState, useCookie } from "#app";
import { tokenize, keys } from "./utils";
import { computed } from "vue";

export interface UnthemeState {}

export const useUntheme = () => {
  const mode = useCookie<"light" | "dark">("untheme-mode", {
    default: () => "dark",
  });
  const configState = useState("untheme-config", () => ({ ...config }));

  const tokens = computed<Record<string, string | null>>(() => {
    const elementTokens: Record<string, string | null> = {};

    // Build element tokens from elements config
    if (configState.value.elements) {
      const elements = keys(configState.value.elements);
      elements.forEach((element) => {
        const attrs = keys(configState.value.elements[element]);
        attrs.forEach((attr) => {
          const key = tokenize(element as string, attr as string);
          elementTokens[key] = configState.value.elements[element][attr];
        });
      });
    }

    // Build theme tokens if present
    const themeTokens: Record<string, string> = {};
    if (configState.value.theme) {
      if (configState.value.theme.reference) {
        Object.assign(themeTokens, configState.value.theme.reference);
      }
      if (configState.value.theme.modes?.[mode.value]) {
        Object.assign(themeTokens, configState.value.theme.modes[mode.value]);
      }
    }

    return {
      ...themeTokens,
      ...elementTokens,
    };
  });

  const setMode = (newMode: "light" | "dark") => {
    mode.value = newMode;
  };

  const setConfig = (newConfig: typeof config) => {
    configState.value = defu(newConfig, configState.value);
  };

  const isToken = (value: unknown): value is string => {
    return (
      typeof value === "string" &&
      value in tokens.value &&
      tokens.value[value] !== null
    );
  };

  const resolve = (
    token: string,
    visited: Set<string> = new Set(),
  ): string | null => {
    if (visited.has(token)) {
      throw new Error(
        `[untheme] Circular token reference: ${[...visited, token].join(" → ")}`,
      );
    }
    visited.add(token);
    const value = tokens.value[token];
    return isToken(value) ? resolve(value, visited) : value;
  };

  return {
    mode,
    config: configState,
    tokens,
    setMode,
    setConfig,
    isToken,
    resolve,
  };
};

export const useTokenStyle = (
  tokens?: Record<string, Record<string, string | null>>,
) => {
  const store = useUntheme();

  return computed(() => {
    const styles: Record<string, Record<string, string | null>> = {};

    if (!tokens) return styles;

    keys(tokens).forEach((element) => {
      const elementTokens = tokens[element];
      if (!elementTokens) return;

      const elementStyles: Record<string, string | null> = {};

      keys(elementTokens).forEach((tokenKey) => {
        const value = elementTokens[tokenKey];
        if (value && store.isToken(value)) {
          elementStyles[`--${element}-${String(tokenKey)}`] =
            store.resolve(value);
        }
      });

      styles[element] = elementStyles;
    });

    return styles;
  });
};
