// The vue date range grid with the `prev` and `next` icons before its month
// controls.
import Core from "@zoobzio/vue/components/date-range-grid.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: {
    prevPrepend: () => [icon("prev")],
    nextPrepend: () => [icon("next")],
  },
});
