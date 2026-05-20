import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import type { ThemeRegistry, ThemeManifest, CustomColor } from "./config";
import type { RoleTokens } from "./types";

import {
  defineNuxtModule,
  addTemplate,
  addTypeTemplate,
  addPlugin,
  addImports,
  addServerHandler,
  createResolver,
} from "@nuxt/kit";

export interface ThemeModuleOptions<C extends string = string> {
  defaultTheme?: string;
  themes?: ThemeRegistry;
  colors?: Record<C, CustomColor>;
  roles?: RoleTokens<C>;
}

export default defineNuxtModule<ThemeModuleOptions>({
  meta: {
    name: "untheme",
    configKey: "untheme",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    const themes = options.themes || {};
    const colors = options.colors || {};
    const roles = options.roles || {};
    const defaultTheme = options.defaultTheme || Object.keys(themes)[0];
    const defaultThemeData = defaultTheme ? themes[defaultTheme] : null;

    const manifest: ThemeManifest = Object.entries(themes).map(([key, theme]) => ({
      key,
      label: theme.label || key,
    }));

    nuxt.options.css.push(resolver.resolve("../runtime/reset.css"));

    addTemplate({
      filename: "untheme.config.mjs",
      getContents: () => [
        `export const defaultTheme = ${JSON.stringify(defaultTheme || null)};`,
        `export const manifest = ${JSON.stringify(manifest)};`,
        `export const defaultThemeData = ${JSON.stringify(defaultThemeData)};`,
        `export const colors = ${JSON.stringify(colors)};`,
        `export const roles = ${JSON.stringify(roles)};`,
      ].join("\n"),
      write: true,
    });

    addTypeTemplate({
      filename: "untheme.config.d.ts",
      getContents: () => [
        `import type { Theme, ThemeManifest, CustomColor } from "${resolver.resolve("../src/types")}";`,
        `export declare const defaultTheme: string;`,
        `export declare const manifest: ThemeManifest;`,
        `export declare const defaultThemeData: Theme;`,
        `export declare const colors: Record<string, CustomColor>;`,
        `export declare const roles: Record<string, string>;`,
      ].join("\n"),
    });

    addTypeTemplate({
      filename: "untheme.hooks.d.ts",
      getContents: () => `export {} from "${resolver.resolve("./hooks")}";`,
    });

    addServerHandler({
      route: "/api/untheme/:theme",
      handler: resolver.resolve("../runtime/server"),
    });

    addPlugin(resolver.resolve("../runtime/plugin"));

    addImports([
      { name: "useTheme", from: resolver.resolve("../runtime/composables") },
    ]);

    const outputDir = join(nuxt.options.rootDir, ".untheme");
    mkdirSync(outputDir, { recursive: true });

    for (const [key, theme] of Object.entries(themes)) {
      writeFileSync(
        join(outputDir, `${key}.json`),
        JSON.stringify(theme, null, 2),
      );
    }
  },
});
