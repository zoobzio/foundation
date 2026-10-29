// The vue multi select with the `expand` icon after its display and the
// layer's Checkbox rendering each item's checkbox.
import Core from "@zoobzio/vue/components/multi-select.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";

export default wrap(Core, {
  pt: { itemCheckbox: () => ({ as: Checkbox }) },
  slots: { triggerAppend: () => [icon("expand")] },
});
