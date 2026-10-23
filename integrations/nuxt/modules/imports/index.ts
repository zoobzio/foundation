import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import {
  addComponent,
  addImports,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";

import {
  COMPONENTS,
  DEFINITIONS,
  LAYER,
  LAYER_TYPES,
  VUE_TYPES,
  WRAPPED,
} from "./constant";
import { pascal, wrapped } from "./util";

export default defineNuxtModule({
  meta: { name: "@zoobzio/nuxt/imports" },
  setup(_, nuxt) {
    const require = createRequire(import.meta.url);
    const resolve = (subpath: string): string =>
      require.resolve(`@zoobzio/vue/${subpath}`);
    const dist = (subpath: string): string =>
      join(dirname(require.resolve("@zoobzio/vue/package.json")), ".dist", subpath);

    const resolver = createResolver(import.meta.url);
    const app = (subpath: string): string =>
      resolver.resolve("../../app", subpath);

    for (const name of COMPONENTS) {
      addComponent({
        name: pascal(name),
        filePath: wrapped(name, WRAPPED)
          ? app(`components/${name}.vue`)
          : resolve(`components/${name}.vue`),
        declarationPath: wrapped(name, WRAPPED)
          ? undefined
          : dist(`components/${name}.vue`),
        export: "default",
      });
    }

    addImports(
      DEFINITIONS.map((name) => ({
        name: `define${pascal(name)}`,
        from: resolve(`definitions/${name}`),
        typeFrom: dist(`definitions/${name}.d.ts`),
      })),
    );

    addImports(
      Object.entries(VUE_TYPES).flatMap(([subpath, names]) =>
        names.map((name) => ({
          name,
          from: resolve(`types/${subpath}`),
          typeFrom: dist(`types/${subpath}.d.ts`),
          type: true,
        })),
      ),
    );

    addImports(
      Object.entries(LAYER).flatMap(([subpath, names]) =>
        names.map((name) => ({ name, from: app(`${subpath}.ts`) })),
      ),
    );

    addImports(
      Object.entries(LAYER_TYPES).flatMap(([subpath, names]) =>
        names.map((name) => ({
          name,
          from: app(`${subpath}.ts`),
          type: true,
        })),
      ),
    );

    nuxt.hook("prepare:types", ({ references }) => {
      references.push({ path: resolver.resolve("../../app/app.d.ts") });
    });
  },
});
