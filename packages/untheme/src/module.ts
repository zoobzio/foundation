import type { UnthemeConfig } from "#untheme/config";

import {
  defineNuxtModule,
  addTemplate,
  addImports,
  addPlugin,
  addImportsDir,
  createResolver,
} from "@nuxt/kit";

import defu from "defu";
import theme from "#untheme/defaults";

export default defineNuxtModule<UnthemeConfig>({
  meta: {
    name: "untheme",
    configKey: "untheme",
  },
  setup(options) {
    const resolver = createResolver(import.meta.url);
    const tokens = defu(options, theme);

    addTemplate({
      filename: "untheme.config.mjs",
      getContents: () => `export default ${JSON.stringify(tokens, null, 2)};`,
    });

    // Register plugin
    addPlugin(resolver.resolve("../runtime/plugins/untheme"));

    // Auto-import composables
    addImportsDir(resolver.resolve("../runtime/composables"));

    // Auto-import types from untheme package
    addImports([
      { name: "RefToken", from: "@foundation/untheme/config", type: true },
      { name: "ModeToken", from: "@foundation/untheme/config", type: true },
      { name: "RoleToken", from: "@foundation/untheme/config", type: true },
      { name: "Token", from: "@foundation/untheme/config", type: true },
      { name: "Tokens", from: "@foundation/untheme/config", type: true },
      { name: "Untheme", from: "@foundation/untheme/config", type: true },
      { name: "UnthemeConfig", from: "@foundation/untheme/config", type: true },
    ]);
  },
});
