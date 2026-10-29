// The vue autocomplete with the layer's Scroller as the viewport of its
// active panel.
import Core from "@zoobzio/vue/components/autocomplete.vue";

import { wrap } from "@zoobzio/vue/utils/wrap";
import Scroller from "./scroller";

export default wrap(Core, {
  pt: { viewport: { as: Scroller } },
});
