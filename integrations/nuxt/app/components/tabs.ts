// The vue tabs with NuxtLink under its `link` part, a tab's `icon` before
// its label, and each label in the visitor's locale.
import Core from "@zoobzio/vue/components/tabs.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";
import { textSlot } from "./text";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    triggerPrepend: ({ option }) => iconOf(option.icon),
    triggerLabel: ({ option }) => textSlot(option.label),
  },
});
