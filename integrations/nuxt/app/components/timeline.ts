// The vue timeline in the visitor's locale: its search, where the service
// is searchable, is the layer's TableSearch, under the visitor's
// placeholder, and its refresh draws the `refresh` icon under the
// visitor's label; where the timeline has a sync, the menu behind it is
// the layer's Menu, its items in the visitor's locale and `check` after
// the interval the sync is on. The button that loads the next batch and
// the text of a timeline with no record read in the visitor's locale too.
// A record's name is the record's own text, never a message.
import type { TimelinePassthrough } from "@zoobzio/vue/types/components/timeline";
import type { RecordData } from "@zoobzio/timeline";

import Core from "@zoobzio/vue/components/timeline.vue";

import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Menu from "./menu";
import TableSearch from "./table-search";
import { syncLabel, syncMark } from "./sync";
import { iconPart } from "./icon";
import { text, textSlot } from "./text";

export default wrap(Core, {
  pt: (pt) =>
    layer<TimelinePassthrough<RecordData>>(pt, {
      search: { as: TableSearch, placeholder: text("timeline.search") },
      refresh: { label: text("timeline.refresh") },
      syncMenu: { as: Menu },
      more: { label: text("timeline.more") },
    }),
  slots: {
    refresh: ({ settings }) => iconPart(settings.refresh, "refresh"),
    syncLabel: ({ item }) => syncLabel(item),
    syncAppend: ({ timeline, item }) => syncMark(timeline.sync, item),
    empty: () => textSlot("timeline.empty"),
  },
});
