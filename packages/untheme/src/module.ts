import type { ThemeRegistry } from "./config";

import {
  defineNuxtModule,
  addTemplate,
  addPlugin,
  addImports,
  createResolver,
} from "@nuxt/kit";

export interface UnthemeModuleOptions {
  defaultTheme?: string;
  themes?: ThemeRegistry;
}

export default defineNuxtModule<UnthemeModuleOptions>({
  meta: {
    name: "untheme",
    configKey: "untheme",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    const themes = options.themes || {};
    const defaultTheme = options.defaultTheme || Object.keys(themes)[0];

    // Global reset CSS
    nuxt.options.css.push(resolver.resolve("../runtime/reset.css"));

    // Virtual module — full theme registry available client-side
    addTemplate({
      filename: "untheme.themes.mjs",
      getContents: () =>
        `export const defaultTheme = ${JSON.stringify(defaultTheme || null)};\nexport const themeNames = ${JSON.stringify(Object.keys(themes))};\nexport const themes = ${JSON.stringify(themes)};`,
      write: true,
    });

    // Register plugin for color mode + theme management
    addPlugin(resolver.resolve("../runtime/plugin"));

    // Auto-import useUntheme composable
    addImports([
      { name: "useUntheme", from: resolver.resolve("../runtime/composables") },
    ]);
  },
});
