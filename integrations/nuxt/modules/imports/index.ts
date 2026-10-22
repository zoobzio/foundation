import { createRequire } from "node:module";
import {
  addComponent,
  addImports,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";

import { COMPONENTS, DEFINITIONS, LAYER, LAYER_TYPES } from "./constant";
import { pascal } from "./util";

export default defineNuxtModule({
  meta: { name: "@zoobzio/nuxt/imports" },
  setup() {
    // @zoobzio/vue: components into #components, define* into #imports.
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

    // The layer's own app/ files into #imports, values and types alike.
    const resolver = createResolver(import.meta.url);
    const app = (subpath: string): string =>
      resolver.resolve("../../app", `${subpath}.ts`);

    addImports(
      Object.entries(LAYER).flatMap(([subpath, names]) =>
        names.map((name) => ({ name, from: app(subpath) })),
      ),
    );

    addImports(
      Object.entries(LAYER_TYPES).flatMap(([subpath, names]) =>
        names.map((name) => ({ name, from: app(subpath), type: true })),
      ),
    );
  },
});
