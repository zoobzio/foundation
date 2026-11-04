// The vue toast with the `close` icon before its close, and its title and
// description resolved.
import Core from "@zoobzio/vue/components/toast.vue";

import { icon } from "./icon";
import { textIf } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    title: textIf(props.title),
    description: textIf(props.description),
  }),
  slots: { closePrepend: () => [icon("close")] },
});
