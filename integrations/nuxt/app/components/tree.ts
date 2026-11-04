// The vue tree with NuxtLink under its `link` part, `expand` as the toggle
// of a node with children, and the nodes' text resolved at every depth.
import Core from "@zoobzio/vue/components/tree.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { icon } from "./icon";
import { texts } from "./text";

export default wrap(Core, {
  props: (props) => ({ ...props, items: texts(props.items) }),
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    itemToggle: ({ item }) => (item.hasChildren ? [icon("expand")] : []),
  },
});
