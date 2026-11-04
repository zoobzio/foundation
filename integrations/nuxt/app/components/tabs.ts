// The vue tabs with NuxtLink under its `link` part, a tab's `icon` before
// its label, and the tabs' text resolved.
import Core from "@zoobzio/vue/components/tabs.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";
import { texts } from "./text";

export default wrap(Core, {
  props: (props) => ({ ...props, tabs: texts(props.tabs) }),
  pt: { link: () => ({ as: NuxtLink }) },
  slots: { triggerPrepend: ({ option }) => iconOf(option.icon) },
});
