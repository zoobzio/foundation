// The vue facets with the `filter` icon as the content of its trigger and
// the layer's Command behind it, so a facet's `icon` draws before its
// label.
import Core from "@zoobzio/vue/components/facets.vue";

import { iconPart } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Command from "./command";

export default wrap(Core, {
  pt: { command: { as: Command } },
  slots: { trigger: ({ settings }) => iconPart(settings.trigger, "filter") },
});
