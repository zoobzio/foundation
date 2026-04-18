import {
  defineNuxtModule,
  addTemplate,
  addImports,
  createResolver,
} from "@nuxt/kit";
import type { IconData } from "./config";

export default defineNuxtModule<Record<string, IconData>>({
  meta: {
    name: "iconic",
    configKey: "iconic",
  },
  setup(iconData) {
    const resolver = createResolver(import.meta.url);

    addTemplate({
      filename: "iconic.config.mjs",
      write: true,
      getContents: () => `export default ${JSON.stringify(iconData, null, 2)};`,
    });

    // Auto-import types
    addImports([
      { name: "Iconic", from: "@zoobz-io/iconic/types", type: true },
      { name: "IconAlias", from: "@zoobz-io/iconic/types", type: true },
    ]);

    // Auto-import composables
    addImports({
      name: "useIconAlias",
      from: resolver.resolve("../runtime/composables/iconic"),
    });
  },
});
