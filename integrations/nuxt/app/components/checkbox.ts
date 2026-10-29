// The vue checkbox with the `check` icon as its indicator.
import Core from "@zoobzio/vue/components/checkbox.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: { icon: () => [icon("check")] },
});
