// @ts-ignore only available at runtime within a module
import config from "#build/untheme.config.mjs";
// @ts-ignore generated at build time
import type { ElementRegistry } from "#build/types/untheme.d.ts";
import { useState } from "#app";
import { computed } from "vue";

export { defineTokens } from "./defineTokens";

export const useUntheme = () => {
  const mode = useState<"light" | "dark">("untheme-mode", () => "dark");

  const setMode = (newMode: "light" | "dark") => {
    mode.value = newMode;
  };

  return {
    mode,
    setMode,
  };
};

// Helper to check if a value is a token reference
const isTokenReference = (value: string): boolean => {
  return value.startsWith('ref-') || value.startsWith('sys-') || value.startsWith('shiki-');
};

// Helper to wrap token references in var()
const wrapValue = (value: string): string => {
  if (isTokenReference(value)) {
    return `var(--${value})`;
  }
  return value;
};

type ElementConfig = { keys: string[]; roles: string[] };
type ConfigType = Record<string, ElementConfig>;

// Token input type - matches Tokens<T> from types.ts
type TokenInput = {
  [K in keyof ElementRegistry]?: ElementRegistry[K];
};

// Runtime token style overrides - only supports tokens defined in the registry
export const useTokenStyle = (tokens?: TokenInput) => {
  return computed(() => {
    const styles: Record<string, Record<string, string>> = {};

    if (!tokens) return styles;

    const typedConfig = config as ConfigType;

    Object.entries(tokens).forEach(([elementName, elementTokens]) => {
      if (!elementTokens) return;

      // Get the element config (now { keys, roles })
      const elementConfig = typedConfig[elementName];
      if (!elementConfig) return;

      const elementStyles: Record<string, string> = {};

      Object.entries(elementTokens).forEach(([tokenKey, value]) => {
        // Only allow overrides for tokens that are defined in the registry
        if (value != null && typeof value === 'string' && elementConfig.keys.includes(tokenKey)) {
          elementStyles[`--${elementName}-${tokenKey}`] = wrapValue(value);
        }
      });

      if (Object.keys(elementStyles).length > 0) {
        styles[elementName] = elementStyles;
      }
    });

    return styles;
  });
};
