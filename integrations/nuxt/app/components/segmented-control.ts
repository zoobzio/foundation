// The vue segmented control with NuxtLink under its `link` part and an
// option's `icon` drawn before its label.
import Core from "@zoobzio/vue/components/segmented-control.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
  slots: { itemPrepend: ({ option }) => iconOf(option.icon) },
});
