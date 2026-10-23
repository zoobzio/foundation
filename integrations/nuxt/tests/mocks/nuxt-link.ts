// Vitest shim for `#app/components/nuxt-link`, the module behind NuxtLink.
//
import { defineComponent, h, markRaw } from "vue";

// The router link the layer lays under every `link` part: an anchor marked
// `data-nuxt`, with whatever attributes it receives. The real NuxtLink
// takes `href` as an alias of `to`; the shim renders it as given. Marked
// raw: test-utils makes the mount props deeply reactive, and Vue warns on
// a proxied component.
const NuxtLink = markRaw(
  defineComponent({
    name: "NuxtLink",
    setup(_, { attrs, slots }) {
      return () => h("a", { ...attrs, "data-nuxt": "" }, slots.default?.());
    },
  }),
);

export default NuxtLink;
