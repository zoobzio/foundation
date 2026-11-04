// The vue breadcrumb with NuxtLink under its `link` part, an item's `icon`
// before its label, each label in the visitor's locale, and its accessible
// name in the visitor's locale unless the consumer names it.
import Core from "@zoobzio/vue/components/breadcrumb.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";
import { text, textIn, textSlot } from "./text";

export default wrap(Core, {
  props: (props) =>
    Object.assign({ "aria-label": text("breadcrumb.label") }, props),
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    itemPrepend: ({ item }) => iconOf(item.icon),
    itemLabel: ({ item, last }) =>
      last ? textSlot(item.label) : textIn("span", "f-span", item.label),
  },
});
