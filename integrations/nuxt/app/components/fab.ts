// The vue fab with its label resolved.
import Core from "@zoobzio/vue/components/fab.vue";

import { textIf } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({ ...props, label: textIf(props.label) }),
});
