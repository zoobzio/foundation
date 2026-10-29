// The vue scroller with the `top` icon before its back-to-top label.
import Core from "@zoobzio/vue/components/scroller.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: { backToTopPrepend: () => [icon("top")] },
});
