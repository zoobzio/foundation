import { defineNuxtModule, addTemplate } from "nuxt/kit";

export default defineNuxtModule<Record<string, string>>({
  meta: {
    name: "iconic",
    configKey: "iconic",
  },
  setup(iconData) {
    addTemplate({
      filename: "iconic.config.mjs",
      write: true,
      getContents: () => `export default ${JSON.stringify(iconData, null, 2)};`,
    });
  },
});
