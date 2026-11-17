// The vue checkbox with the `check` icon as its indicator, and
// `indeterminate` in its place while the checkbox is neither on nor off: a
// select-all over some of the rows.
import Core from "@zoobzio/vue/components/checkbox.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: {
    icon: ({ modelValue }) => [
      icon(modelValue.value === "indeterminate" ? "indeterminate" : "check"),
    ],
  },
});
