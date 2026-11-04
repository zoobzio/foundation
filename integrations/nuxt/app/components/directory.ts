// The vue directory with NuxtLink under its `link` part, an item's `icon`
// before its label, and the groups' text resolved.
import Core from "@zoobzio/vue/components/directory.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";
import { texts } from "./text";

export default wrap(Core, {
  props: (props) => ({ ...props, groups: texts(props.groups) }),
  pt: { link: () => ({ as: NuxtLink }) },
  slots: { itemPrepend: ({ item }) => iconOf(item.icon) },
});
