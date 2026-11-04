// The vue select with the `expand` icon after its display, and its text —
// the options, the selection, the placeholder — resolved.
import Core from "@zoobzio/vue/components/select.vue";

import { icon } from "./icon";
import { textOr, texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    options: texts(props.options),
    modelValue: texts(props.modelValue),
    placeholder: textOr(props.placeholder, "select.placeholder"),
  }),
  slots: { triggerAppend: () => [icon("expand")] },
});
