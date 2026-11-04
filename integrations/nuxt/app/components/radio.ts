// The vue radio with its options' text resolved.
import Core from "@zoobzio/vue/components/radio.vue";

import { texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({ ...props, options: texts(props.options) }),
});
