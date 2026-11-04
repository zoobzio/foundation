// The vue multi-select with the layer's Checkbox rendering each item's
// checkbox, the `expand` icon after its trigger, and its text — the
// options, the selection, the placeholder — resolved.
import Core from "@zoobzio/vue/components/multi-select.vue";

import { icon } from "./icon";
import { textOr, texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    items: texts(props.items),
    modelValue: texts(props.modelValue),
    placeholder: textOr(props.placeholder, "select.multiple"),
  }),
  pt: { itemCheckbox: () => ({ as: Checkbox }) },
  slots: { triggerAppend: () => [icon("expand")] },
});
