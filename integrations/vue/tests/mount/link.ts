import { defineComponent, h } from "vue";

/**
 * A stand-in router link: renders an anchor marked `data-router`, with
 * whatever attributes it receives. The shape a consumer swaps in through
 * `pt.link` (`as: RouterLink`).
 */
export const RouterLink = defineComponent({
  name: "RouterLink",
  setup(_, { attrs, slots }) {
    return () => h("a", { ...attrs, "data-router": "" }, slots.default?.());
  },
});
