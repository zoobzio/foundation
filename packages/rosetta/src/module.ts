import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import {
  defineNuxtModule,
  addTemplate,
  addPlugin,
  addImports,
  addTypeTemplate,
  addVitePlugin,
  addServerHandler,
  createResolver,
} from "@nuxt/kit";

import type { I18nConfig } from "./types";
import { i18nVitePlugin, type I18nPluginContext } from "./vite";
import { buildPageMap } from "./extract";
import { mockProvider } from "./providers";

export default defineNuxtModule<I18nConfig>({
  meta: {
    name: "rosetta",
    configKey: "rosetta",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    const defaultLocale = options.defaultLocale || "en";
    const locales = options.locales || [defaultLocale];
    const provider = options.provider || mockProvider;

    const writeArtifacts = async (ctx: I18nPluginContext) => {
      const outputDir = join(nuxt.options.rootDir, ".rosetta");
      mkdirSync(outputDir, { recursive: true });

      const pageMap = buildPageMap(ctx.fileMap);

      writeFileSync(
        join(outputDir, "source.json"),
        JSON.stringify(ctx.sourceMap, null, 2),
      );

      writeFileSync(
        join(outputDir, "pages.json"),
        JSON.stringify(pageMap, null, 2),
      );

      for (const locale of locales) {
        const messages = await provider.translate(ctx.sourceMap, locale);
        writeFileSync(
          join(outputDir, `${locale}.json`),
          JSON.stringify(messages, null, 2),
        );
      }
    };

    const ctx: I18nPluginContext = {
      sourceMap: {},
      fileMap: {},
      writeArtifacts: () => writeArtifacts(ctx),
    };

    // Register vite plugin — transforms source and writes artifacts on buildEnd
    addVitePlugin(i18nVitePlugin(ctx));

    // Virtual module — runtime config
    addTemplate({
      filename: "rosetta.config.mjs",
      write: true,
      getContents: () =>
        `export const defaultLocale = ${JSON.stringify(defaultLocale)};\nexport const locales = ${JSON.stringify(locales)};`,
    });

    addTypeTemplate({
      filename: "rosetta.hooks.d.ts",
      getContents: () => `export {} from "${resolver.resolve("./hooks")}";`,
    });

    // Auto-import composable + $t
    addImports([
      { name: "useI18n", from: resolver.resolve("../runtime/composables") },
      { name: "$t", from: resolver.resolve("../runtime/composables") },
    ]);

    // Register plugin for locale initialization
    addPlugin(resolver.resolve("../runtime/plugin"));

    // Register the server route handler
    addServerHandler({
      route: "/api/lang/:locale/:route",
      handler: resolver.resolve("../runtime/server"),
    });
  },
});
