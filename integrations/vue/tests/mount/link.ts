import { defineComponent, h, markRaw } from "vue";

/**
 * A stand-in router link: renders an anchor marked `data-router`, with
 * whatever attributes it receives. The shape a consumer swaps in through
 * `pt.link` (`as: RouterLink`). Marked raw: test-utils makes the mount
 * props deeply reactive, and Vue warns on a proxied component.
 */
export const RouterLink = markRaw(
  defineComponent({
    name: "RouterLink",
    setup(_, { attrs, slots }) {
      return () => h("a", { ...attrs, "data-router": "" }, slots.default?.());
    },
  }),
);
