// The vue date picker with the `calendar` icon before its trigger label and
// the `prev` and `next` icons before its month controls.
import Core from "@zoobzio/vue/components/date-picker.vue";

import { icon } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: {
    triggerPrepend: () => [icon("calendar")],
    prevPrepend: () => [icon("prev")],
    nextPrepend: () => [icon("next")],
  },
});
