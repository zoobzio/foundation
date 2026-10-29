// The vue toast with the `close` icon before its close label.
import Core from "@zoobzio/vue/components/toast.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: { closePrepend: () => [icon("close")] },
});
