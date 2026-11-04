// The vue select with the `expand` icon after its display, and its text —
// the options, the selection, the placeholder — in the visitor's locale.
import Core from "@zoobzio/vue/components/select.vue";

import { icon } from "./icon";
import { textIn, textOr, textSlot } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    placeholder: textOr(props.placeholder, "select.placeholder"),
  }),
  slots: {
    triggerLabel: ({ modelValue, placeholder }) =>
      textIn("span", "f-span", modelValue.value?.label ?? placeholder),
    itemLabel: ({ option }) => textSlot(option.label),
    triggerAppend: () => [icon("expand")],
  },
});
