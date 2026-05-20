import {
  defineNuxtModule,
  addTemplate,
  addImports,
  createResolver,
  useNuxt,
} from "@nuxt/kit";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { IconEntry } from "./config";

export default defineNuxtModule<{
  entries: Record<string, IconEntry>;
  sprite: string;
}>({
  meta: {
    name: "iconic",
    configKey: "iconic",
  },
  setup({ entries, sprite }) {
    const resolver = createResolver(import.meta.url);
    const nuxt = useNuxt();

    const iconicDir = join(nuxt.options.buildDir, "iconic");
    mkdirSync(iconicDir, { recursive: true });
    writeFileSync(join(iconicDir, "icons.svg"), sprite, "utf-8");

    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
    nuxt.options.nitro.publicAssets.push({
      dir: iconicDir,
      baseURL: "/",
    });

    addTemplate({
      filename: "iconic.config.mjs",
      write: true,
      getContents: () => `export default ${JSON.stringify(entries, null, 2)};`,
    });

    addImports([
      { name: "IconAliases", from: "@zoobz-io/iconic/types", type: true },
      { name: "IconAlias", from: "@zoobz-io/iconic/types", type: true },
    ]);

    addImports({
      name: "useIconAlias",
      from: resolver.resolve("../runtime/composables/iconic"),
    });
  },
});
