// The layer's Autocomplete as the table's search: the `magic` icon before
// its input, the search key drawn as a `kbd` after it, and that key
// focusing the input from anywhere on the page the user is not already
// typing. It stands in for the Autocomplete: attrs pass through, a
// consumer's slot wins over the defaults, its `update:open` is relayed,
// and its `ctx` is exposed as this one's.
import type { Component, ComponentPublicInstance, VNode } from "vue";

import { computed, defineComponent, h, shallowRef } from "vue";
import { TABLE_SEARCH_KEY } from "../constants/table";
import { useFocusKey } from "../composables/focus";
import Autocomplete from "./autocomplete";
import { icon } from "./icon";

type Instance = ComponentPublicInstance & { ctx?: unknown };

// Rendered as a plain component, as `wrap` renders its core: the attrs are
// the consumer's props, handed on whole rather than checked here.
const Core: Component = Autocomplete;

export default defineComponent({
  name: "TableSearch",
  inheritAttrs: false,
  emits: ["update:open"],
  setup(_, { attrs, slots, emit, expose }) {
    const el = shallowRef<Instance | null>(null);
    // The autocomplete's root is a fragment, so the input is reached from
    // the key hint, which the autocomplete renders in the input's group.
    const hint = shallowRef<HTMLElement | null>(null);
    useFocusKey(
      () => hint.value?.parentElement?.querySelector("input") ?? null,
      TABLE_SEARCH_KEY,
    );
    expose({ ctx: computed(() => el.value?.ctx) });
    return (): VNode =>
      h(
        Core,
        {
          ...attrs,
          "onUpdate:open": (open: boolean) => emit("update:open", open),
          ref: el,
        },
        {
          inputPrepend: () => [icon("magic")],
          inputAppend: () => [
            h(
              "kbd",
              { ref: hint, class: "f-kbd", "aria-hidden": "true" },
              TABLE_SEARCH_KEY,
            ),
          ],
          ...slots,
        },
      );
  },
});
