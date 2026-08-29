import { beforeEach } from "vitest";
import { config } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { clearNuxtHooks, clearNuxtStateRegistry } from "#test/mocks/imports";

// The `Icon` global is registered by @icon-sheets/nuxt at build time; the
// no-Nuxt vitest environment mirrors it so `<use href="#alias">` assertions
// keep working.
config.global.components = {
  ...config.global.components,
  Icon: defineComponent(
    (props: { name: string }) => {
      return () => h("svg", [h("use", { href: `#${props.name}` })]);
    },
    { name: "Icon", props: ["name"] },
  ),
};

// Shared useState refs and hook listeners (see mocks/imports.ts) must not
// leak between tests.
beforeEach(() => {
  clearNuxtStateRegistry();
  clearNuxtHooks();
});
