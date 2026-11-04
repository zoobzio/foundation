// The vue multi-select with the layer's Checkbox rendering each item's
// checkbox, the `expand` icon after its trigger, and its text — the items,
// the selection, the placeholder — in the visitor's locale.
import Core from "@zoobzio/vue/components/multi-select.vue";

import { SELECT_TRUNCATE } from "@zoobzio/vue/constants/selection";
import { icon } from "./icon";
import { text, textIn, textOr, textSlot } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    placeholder: textOr(props.placeholder, "select.multiple"),
  }),
  pt: { itemCheckbox: () => ({ as: Checkbox }) },
  slots: {
    triggerLabel: ({ modelValue, placeholder }) =>
      textIn(
        "span",
        "f-span",
        modelValue.value?.length
          ? modelValue.value
              .slice(0, SELECT_TRUNCATE)
              .map((item) => text(item.label))
              .join(", ")
          : placeholder,
      ),
    itemLabel: ({ item }) => textSlot(item.label),
    triggerAppend: () => [icon("expand")],
  },
});
