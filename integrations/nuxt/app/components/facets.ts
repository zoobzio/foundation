// The vue facets with the layer's Command behind its popover, the `filter`
// icon as its trigger's content, and its text — the trigger, the groups and
// their items, the placeholder — resolved.
import Core from "@zoobzio/vue/components/facets.vue";

import { iconPart } from "./icon";
import { text, textOr, texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Command from "./command";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    groups: texts(props.groups),
    placeholder: textOr(props.placeholder, "facets.placeholder"),
  }),
  pt: (pt) => ({
    ...pt,
    trigger: { label: text("facets.trigger"), ...pt?.trigger },
    command: { as: Command, ...pt?.command },
  }),
  slots: { trigger: ({ settings }) => iconPart(settings.trigger, "filter") },
});
