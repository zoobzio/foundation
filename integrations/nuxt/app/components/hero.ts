// The vue hero with NuxtLink under its `link` part, and its description and
// its action's label in the visitor's locale.
import Core from "@zoobzio/vue/components/hero.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { textIf, textSlot } from "./text";

export default wrap(Core, {
  props: (props) => ({ ...props, description: textIf(props.description) }),
  pt: { link: { as: NuxtLink } },
  slots: {
    actionLabel: ({ action }) => (action ? textSlot(action.label) : []),
  },
});
