// The vue calendar with its toolbar dressed: each tool is named in the
// visitor's locale, the name its accessible name and its tooltip, and the
// two steps draw their icons in place of their labels; today and the views
// keep their names as text. Its search, where the service is searchable,
// is the layer's TableSearch (the Autocomplete with the `magic` icon, the
// search key, and that key focusing it), under the visitor's placeholder,
// and its refresh draws the `refresh` icon under the visitor's label. An
// untitled occurrence and the empty agenda read in the visitor's locale
// too.
import type {
  CalendarPassthrough,
  CalendarTool,
} from "@zoobzio/vue/types/components/calendar";
import type { VNode } from "vue";

import Core from "@zoobzio/vue/components/calendar.vue";

import { h } from "vue";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import TableSearch from "./table-search";
import { iconOf, iconPart } from "./icon";
import { text, textIn, textSlot } from "./text";
import { toolIcon, toolText } from "../utils/calendar";

/**
 * The layer under the calendar's `pt.tool`: the resolved label as the
 * Fab's accessible name, and as the button's `title`, so an icon-only
 * button still says what it does on hover.
 */
const toolLayer = (tool: CalendarTool): { label: string; title: string } => {
  const label = text(toolText(tool.key) ?? tool.label);
  return { label, title: label };
};

/**
 * The content of a tool's button: its icon where the layer names one, so
 * the button is icon-only, and the resolved label in a span otherwise.
 */
const toolLabel = (tool: CalendarTool): VNode[] => {
  const name = toolIcon(tool.key);
  return name
    ? iconOf(name)
    : textIn("span", "f-span", toolText(tool.key) ?? tool.label);
};

export default wrap(Core, {
  pt: (pt) =>
    layer<CalendarPassthrough>(pt, {
      search: { as: TableSearch, placeholder: text("calendar.search") },
      refresh: { label: text("calendar.refresh") },
      tool: toolLayer,
    }),
  slots: {
    refresh: ({ settings }) => iconPart(settings.refresh, "refresh"),
    toolLabel: ({ tool }) => toolLabel(tool),
    // A title is the entry's own text, never a message; only the name of
    // an entry without one is the layer's.
    occurrenceLabel: ({ occurrence }) =>
      occurrence.entry.title
        ? [h("span", { class: "f-span" }, occurrence.entry.title)]
        : textIn("span", "f-span", "calendar.untitled"),
    empty: () => textSlot("calendar.empty"),
  },
});
