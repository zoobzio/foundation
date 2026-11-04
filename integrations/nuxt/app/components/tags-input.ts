// The vue tags input with the `remove` icon on each tag, and its
// placeholder resolved.
import Core from "@zoobzio/vue/components/tags-input.vue";

import { icon } from "./icon";
import { textOr } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    placeholder: textOr(props.placeholder, "tagsInput.placeholder"),
  }),
  slots: { itemDeletePrepend: () => [icon("remove")] },
});
