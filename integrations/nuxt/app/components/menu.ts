// The vue menu with NuxtLink under its `link` part, an item's `icon` before
// its label, and its text — the trigger's label, the groups' and the
// items' — in the visitor's locale.
import Core from "@zoobzio/vue/components/menu.vue";

import NuxtLink from "#app/components/nuxt-link";
import { Icon } from "#components";
import { h } from "vue";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { textIf, textIn } from "./text";

export default wrap(Core, {
  props: (props) => ({ ...props, label: textIf(props.label) }),
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    groupLabel: ({ group }) =>
      group.label ? textIn("div", "f-caption", group.label) : [],
    itemPrepend: ({ item }) =>
      item.icon ? [h(Icon, { name: item.icon })] : [],
    itemLabel: ({ item }) => textIn("span", "f-span", item.label),
  },
});
