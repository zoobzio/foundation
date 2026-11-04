// The vue segmented control with NuxtLink under its `link` part, an
// option's `icon` before its label, and each label in the visitor's locale.
import Core from "@zoobzio/vue/components/segmented-control.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";
import { textIn } from "./text";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    itemPrepend: ({ option }) => iconOf(option.icon),
    itemLabel: ({ option }) =>
      option.label ? textIn("span", "f-span", option.label) : [],
  },
});
