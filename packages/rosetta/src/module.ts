import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import {
  defineNuxtModule,
  addTemplate,
  addPlugin,
  addImports,
  addVitePlugin,
  addServerHandler,
  createResolver,
} from "@nuxt/kit";

import type { RosettaConfig } from "./types";
import { rosettaVitePlugin, type RosettaPluginContext } from "./vite";
import { buildPageMap } from "./extract";
import { mockProvider } from "./providers";

export default defineNuxtModule<RosettaConfig>({
  meta: {
    name: "rosetta",
    configKey: "rosetta",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    const defaultLocale = options.defaultLocale || "en";
    const locales = options.locales || [defaultLocale];
    const provider = options.provider || mockProvider;

    const ctx: RosettaPluginContext = {
      sourceMap: {},
      fileMap: {},
    };

    // Register vite plugin — always transforms, no dev-mode passthrough
    addVitePlugin(rosettaVitePlugin(ctx));

    // Virtual module — runtime config
    addTemplate({
      filename: "rosetta.config.mjs",
      write: true,
      getContents: () =>
        `export const defaultLocale = ${JSON.stringify(defaultLocale)};\nexport const locales = ${JSON.stringify(locales)};`,
    });

    // Auto-import composable + $t
    addImports([
      { name: "useRosetta", from: resolver.resolve("../runtime/composables") },
      { name: "$t", from: resolver.resolve("../runtime/composables") },
    ]);

    // Register plugin for locale initialization
    addPlugin(resolver.resolve("../runtime/plugin"));

    // Register the server route handler
    addServerHandler({
      route: "/api/rosetta/:locale/:route",
      handler: resolver.resolve("../runtime/server"),
    });

    // After build — resolve page map, run provider for each locale, write artifacts
    nuxt.hook("build:done", async () => {
      const outputDir = join(nuxt.options.rootDir, ".rosetta");
      mkdirSync(outputDir, { recursive: true });

      // Pass 2 — walk import trees to build page-level attribution
      const pageMap = buildPageMap(ctx.fileMap);

      // Write source map (hash → original text)
      writeFileSync(
        join(outputDir, "source.json"),
        JSON.stringify(ctx.sourceMap, null, 2),
      );

      // Write page map (route → hashes[])
      writeFileSync(
        join(outputDir, "pages.json"),
        JSON.stringify(pageMap, null, 2),
      );

      // Run provider for each locale to generate corpora
      for (const locale of locales) {
        const messages = await provider.translate(ctx.sourceMap, locale);
        writeFileSync(
          join(outputDir, `${locale}.json`),
          JSON.stringify(messages, null, 2),
        );
      }
    });
  },
});
