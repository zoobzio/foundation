// The vue pagination with the `first`, `prev`, `next`, and `last` icons as
// the content of its page controls, and the layer's Select as its size
// control.
import Core from "@zoobzio/vue/components/pagination.vue";

import { iconPart } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Select from "./select";

export default wrap(Core, {
  pt: { size: { as: Select } },
  slots: {
    first: ({ settings }) => iconPart(settings.first, "first"),
    prev: ({ settings }) => iconPart(settings.prev, "prev"),
    next: ({ settings }) => iconPart(settings.next, "next"),
    last: ({ settings }) => iconPart(settings.last, "last"),
  },
});
