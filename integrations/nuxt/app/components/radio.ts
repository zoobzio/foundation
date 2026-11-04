// The vue radio with each option's label in the visitor's locale.
import Core from "@zoobzio/vue/components/radio.vue";

import { textIn } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: {
    optionLabel: ({ option }) => textIn("span", "f-span", option.label),
  },
});
