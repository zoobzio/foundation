// The vue facets with the layer's Command behind its popover, the `filter`
// icon as its trigger's content, and its text — the trigger, the
// placeholder — in the visitor's locale. The groups' and the items' labels
// resolve in the Command.
import Core from "@zoobzio/vue/components/facets.vue";

import { iconPart } from "./icon";
import { text, textOr } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Command from "./command";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    placeholder: textOr(props.placeholder, "facets.placeholder"),
  }),
  pt: (pt) => ({
    ...pt,
    trigger: { label: text("facets.trigger"), ...pt?.trigger },
    command: { as: Command, ...pt?.command },
  }),
  slots: { trigger: ({ settings }) => iconPart(settings.trigger, "filter") },
});
