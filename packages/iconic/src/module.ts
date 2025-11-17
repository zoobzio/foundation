import {
  defineNuxtModule,
  addTemplate,
  addImports,
  createResolver,
} from "@nuxt/kit";

export default defineNuxtModule<Record<string, string>>({
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
      { name: "Iconic", from: "@foundation/iconic/types", type: true },
      { name: "IconAlias", from: "@foundation/iconic/types", type: true },
    ]);

    // Auto-import composables
    addImports({
      name: "useIconAlias",
      from: resolver.resolve("../runtime/composables/iconic"),
    });
  },
});
