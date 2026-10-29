// The vue tags input with the `remove` icon before each tag's delete label.
import Core from "@zoobzio/vue/components/tags-input.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: { itemDeletePrepend: () => [icon("remove")] },
});
