import { addTypeTemplate, defineNuxtModule } from "@nuxt/kit";
import { generateA11yTypes } from "#modules/a11y/template";

/**
 * Generates the ARIA role registry consumed by `AriaProps` from the WAI-ARIA
 * spec data in `aria-query`, mirroring how the `modifiers` module generates
 * `ComponentModifiers`. Unlike modifiers there is no consumer config — the aria
 * surface of a role is fixed by the standard, so the output is derived purely
 * from the spec.
 */
export default defineNuxtModule({
  meta: {
    name: "a11y",
    configKey: "a11y",
  },
  setup() {
    addTypeTemplate({
      filename: "types/a11y.d.ts",
      write: true,
      getContents: () => generateA11yTypes(),
    });
  },
});
