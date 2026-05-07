import { computed, watch } from "vue";
import { useNuxtApp } from "#app";
import { useCookie } from "#imports";
import { generateThemeCSS } from "../src/css";
import type { Theme } from "../src/config";
import { isTheme } from "../src/config";
import "../src/hooks";

import { defaultTheme as buildDefault, themeNames, themes } from "#build/untheme.themes.mjs";

const names: string[] = themeNames ?? [];
const buildTheme: string = buildDefault ?? "";

const buildRegistry = (): Record<string, Theme> => {
  const result: Record<string, Theme> = {};
  for (const [key, value] of Object.entries(themes ?? {})) {
    if (isTheme(value)) result[key] = value;
  }
  return result;
};
const registry = buildRegistry();

export const useUntheme = () => {
  const mode = useCookie<"light" | "dark">("untheme-mode", { default: () => "dark" });
  const theme = useCookie<string>("untheme-theme", {
    default: () => {
      return buildTheme;
    },
  });

  // Validate stored theme against available themes
  if (theme.value && !names.includes(theme.value)) {
    theme.value = buildTheme;
  }

  const availableThemes = computed(() => names);

  const nuxtApp = useNuxtApp();

  const setTheme = (name: string) => {
    const prev = theme.value;
    theme.value = name;
    nuxtApp.callHook("untheme:theme", { from: prev, to: name });
  };

  watch(mode, (to, from) => {
    nuxtApp.callHook("untheme:mode", { from, to });
  });

  // Generate CSS for the active theme
  const themeCSS = computed(() => {
    const data = registry[theme.value];
    if (!data) return "";
    return generateThemeCSS(data);
  });

  return {
    mode,
    theme,
    setTheme,
    themes: availableThemes,
    themeCSS,
  };
};
