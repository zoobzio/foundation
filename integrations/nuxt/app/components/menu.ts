// The vue menu with NuxtLink under its `link` part, an item's `icon` before
// its label, and its text — the label, the groups and their items —
// resolved.
import Core from "@zoobzio/vue/components/menu.vue";

import NuxtLink from "#app/components/nuxt-link";
import { Icon } from "#components";
import { h } from "vue";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { textIf, texts } from "./text";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    label: textIf(props.label),
    groups: texts(props.groups),
  }),
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    itemPrepend: ({ item }) =>
      item.icon ? [h(Icon, { name: item.icon })] : [],
  },
});
