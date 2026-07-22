import type { ModifiersInput } from "#modules/modifiers/types";

import { addTypeTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { generateModifierTypes } from "#modules/modifiers/template";
import devModifiers from "#stubs/modifiers";

/** Options accepted under the `modifiers` key in `nuxt.config`. */
export type ModuleOptions = ModifiersInput;

const normalize = (path: string) => path.replace(/[/\\]+$/, "");

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "modifiers",
    configKey: "modifiers",
  },
  defaults: {},
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Simulate a consumer config only while developing foundation itself. When
    // the layer is extended, rootDir is the consumer's app and the dev stub is
    // ignored in favour of their real `modifiers` config.
    const isFoundationRoot =
      normalize(nuxt.options.rootDir) === normalize(resolve("../.."));
    const schema = isFoundationRoot ? { ...devModifiers, ...options } : options;

    addTypeTemplate({
      filename: "types/modifiers.d.ts",
      write: true,
      getContents: () => generateModifierTypes(schema),
    });
  },
});
