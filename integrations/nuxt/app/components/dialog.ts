// The vue dialog with its title and description resolved.
import Core from "@zoobzio/vue/components/dialog.vue";

import { text } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    title: text(props.title),
    description: text(props.description),
  }),
});
