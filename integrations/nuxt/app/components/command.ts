// The vue command with the `search` icon before its filter, an item's
// `icon` before its label, the layer's Checkbox rendering each item's
// checkbox, the layer's Scroller as its viewport, and its text — the
// groups, the options, the placeholder, the empty state — in the
// visitor's locale.
import Core from "@zoobzio/vue/components/command.vue";

import { ListboxGroupLabel } from "reka-ui";
import { h } from "vue";
import { icon, iconOf } from "./icon";
import { text, textIn, textOr, textSlot } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";
import Scroller from "./scroller";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    placeholder: textOr(props.placeholder, "command.placeholder"),
  }),
  pt: {
    viewport: { as: Scroller },
    itemCheckbox: () => ({ as: Checkbox }),
  },
  slots: {
    inputPrepend: () => [icon("search")],
    groupLabel: ({ group, settings }) => [
      h(
        ListboxGroupLabel,
        { class: "f-listbox-group-label", ...settings.groupLabel },
        () => text(group.label),
      ),
    ],
    itemPrepend: ({ item }) => iconOf(item.icon),
    itemLabel: ({ item }) => textIn("span", "f-span", item.label),
    empty: () => textSlot("command.empty"),
  },
});
