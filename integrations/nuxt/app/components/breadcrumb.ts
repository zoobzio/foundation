// The vue breadcrumb with NuxtLink under its `link` part, an item's `icon`
// before its label, the items' text resolved, and its accessible name in
// the visitor's locale unless the consumer names it.
import Core from "@zoobzio/vue/components/breadcrumb.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";
import { text, texts } from "./text";

export default wrap(Core, {
  props: (props) =>
    Object.assign({ "aria-label": text("breadcrumb.label") }, props, {
      items: texts(props.items),
    }),
  pt: { link: () => ({ as: NuxtLink }) },
  slots: { itemPrepend: ({ item }) => iconOf(item.icon) },
});
