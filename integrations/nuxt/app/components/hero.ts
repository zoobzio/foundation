// The vue hero with NuxtLink under its `link` part, and its description and
// action resolved.
import Core from "@zoobzio/vue/components/hero.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { textIf, texts } from "./text";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    description: textIf(props.description),
    action: texts(props.action),
  }),
  pt: { link: { as: NuxtLink } },
});
