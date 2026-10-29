// The vue select with the `expand` icon after its display.
import Core from "@zoobzio/vue/components/select.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: { triggerAppend: () => [icon("expand")] },
});
