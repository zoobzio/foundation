// Vitest shim for Nuxt's virtual `#components` module: the built-in
// components the app shell renders, each reduced to its slot, and the
// `Icon` that @icon-sheets/nuxt registers, reduced to a sprite reference.
// The error boundary keeps Nuxt's `error` emit so a test can raise one
// through it.
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
  setup(props) {
    return () =>
      h("div", { class: "nuxt-loading-indicator", "data-color": props.color });
  },
});

export const Icon = defineComponent({
  name: "Icon",
  props: { name: { type: String, required: true } },
  setup(props) {
    return () =>
      h("svg", { "data-icon": props.name }, [
        h("use", { href: `#${props.name}` }),
      ]);
  },
});
