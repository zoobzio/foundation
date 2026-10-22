import { createRequire } from "node:module";
import { addComponent, addImports, defineNuxtModule } from "@nuxt/kit";

import { COMPONENTS, DEFINITIONS } from "./constant";
import { pascal } from "./util";

export default defineNuxtModule({
  meta: { name: "@zoobzio/nuxt/imports" },
  setup() {
    const require = createRequire(import.meta.url);
    const resolve = (subpath: string): string =>
      require.resolve(`@zoobzio/vue/${subpath}`);

    for (const name of COMPONENTS) {
      addComponent({
        name: pascal(name),
        filePath: resolve(`components/${name}.vue`),
        export: "default",
      });
    }

    addImports(
      DEFINITIONS.map((name) => ({
        name: `define${pascal(name)}`,
        from: resolve(`definitions/${name}`),
      })),
    );
  },
});
