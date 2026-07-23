import type { ComponentTokensInput } from "#modules/tokens/types";

import { addTypeTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { generateComponentTokenTypes } from "#modules/tokens/template";
import devComponentTokens from "#stubs/tokens";

/** Options accepted under the `dtcg` key in `nuxt.config`. */
export type ModuleOptions = ComponentTokensInput;

const normalize = (path: string) => path.replace(/[/\\]+$/, "");

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "dtcg",
    configKey: "dtcg",
  },
  defaults: {},
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Simulate a consumer config only while developing foundation itself. When
    // the layer is extended, rootDir is the consumer's app and the dev stub is
    // ignored in favour of their real `dtcg` config.
    const isFoundationRoot =
      normalize(nuxt.options.rootDir) === normalize(resolve("../.."));
    const schema = isFoundationRoot
      ? { ...devComponentTokens, ...options }
      : options;

    addTypeTemplate({
      filename: "types/tokens.d.ts",
      write: true,
      getContents: () => generateComponentTokenTypes(schema),
    });
  },
});
