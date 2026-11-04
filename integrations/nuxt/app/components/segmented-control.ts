// The vue segmented control with NuxtLink under its `link` part, an
// option's `icon` before its label, and the options' text resolved.
import Core from "@zoobzio/vue/components/segmented-control.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";
import { texts } from "./text";

export default wrap(Core, {
  props: (props) => ({ ...props, options: texts(props.options) }),
  pt: { link: () => ({ as: NuxtLink }) },
  slots: { itemPrepend: ({ option }) => iconOf(option.icon) },
});
