// The vue range calendar with the `prev` and `next` icons before its month
// controls.
import Core from "@zoobzio/vue/components/range-calendar.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: {
    prevPrepend: () => [icon("prev")],
    nextPrepend: () => [icon("next")],
  },
});
