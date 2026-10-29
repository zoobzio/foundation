// The vue file input with the `remove` icon before each file's remove
// label.
import Core from "@zoobzio/vue/components/file-input.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: { itemRemovePrepend: () => [icon("remove")] },
});
