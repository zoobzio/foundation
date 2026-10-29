// The vue keywords with the `keywords` icon as the content of its trigger,
// the layer's TagsInput behind its include and exclude inputs, and the
// layer's SegmentedControl as its match control.
import Core from "@zoobzio/vue/components/keywords.vue";

import { iconPart } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import SegmentedControl from "./segmented-control";
import TagsInput from "./tags-input";

export default wrap(Core, {
  pt: {
    includeInput: { as: TagsInput },
    excludeInput: { as: TagsInput },
    matchControl: { as: SegmentedControl },
  },
  slots: {
    trigger: ({ settings }) => iconPart(settings.trigger, "keywords"),
  },
});
