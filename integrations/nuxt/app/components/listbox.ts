// The vue listbox with its items' text resolved.
import Core from "@zoobzio/vue/components/listbox.vue";

import { texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({ ...props, items: texts(props.items) }),
});
