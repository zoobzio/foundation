import { beforeEach } from "vitest";
import { config } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { clearNuxtHooks, clearNuxtStateRegistry } from "#test/mocks/imports";

// The `NuxtLink` global is registered by Nuxt at runtime; the no-Nuxt vitest
// environment mirrors it as a bare <a> that maps `to` → `href`.
config.global.components = {
  ...config.global.components,
  NuxtLink: defineComponent({
    name: "NuxtLink",
    props: {
      to: { type: String, default: undefined },
      external: { type: Boolean, default: undefined },
      target: { type: String, default: undefined },
      replace: { type: Boolean, default: undefined },
      prefetch: { type: Boolean, default: undefined },
    },
    setup(props, { slots }) {
      return () =>
        h("a", { href: props.to, target: props.target }, slots.default?.());
    },
  }),
};

// Shared useState refs and hook listeners (see mocks/imports.ts) must not
// leak between tests.
beforeEach(() => {
  clearNuxtStateRegistry();
  clearNuxtHooks();
});
