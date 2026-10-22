// Vitest shim for Nuxt's virtual `#components` module: the built-in
// components the app shell renders, each reduced to its slot. The error
// boundary keeps Nuxt's `error` emit so a test can raise one through it.
import { defineComponent, h } from "vue";

const passthrough = (name: string) =>
  defineComponent({
    name,
    setup(_, { slots }) {
      return () => slots.default?.();
    },
  });

export const NuxtLayout = passthrough("NuxtLayout");
export const NuxtPage = passthrough("NuxtPage");

export const NuxtErrorBoundary = defineComponent({
  name: "NuxtErrorBoundary",
  emits: ["error"],
  setup(_, { slots }) {
    return () => slots.default?.();
  },
});

export const NuxtLoadingIndicator = defineComponent({
  name: "NuxtLoadingIndicator",
  props: { color: String, threshold: Number },
  setup() {
    return () => h("div", { class: "nuxt-loading-indicator" });
  },
});
