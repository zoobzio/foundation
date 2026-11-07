// The vue editor as an icon toolbar: each tool draws its icon in place of
// its label, and the label, in the visitor's locale, stays the button's
// accessible name and its tooltip. A tool the layer has no icon for keeps
// its label as text. The block type dropdown reads its trigger and its
// entries in the visitor's locale, with the `expand` icon after the
// trigger's text.
import type { EditorPassthrough } from "@zoobzio/vue/types/components/editor";

import Core from "@zoobzio/vue/components/editor.vue";

import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import {
  blockAppend,
  blockItemLabel,
  blockLabel,
  toolLabel,
  toolLayer,
} from "./editor-tool";

export default wrap(Core, {
  pt: (pt) => layer<EditorPassthrough>(pt, { tool: toolLayer }),
  slots: {
    toolLabel: ({ tool }) => toolLabel(tool),
    blockLabel: ({ block }) => blockLabel(block),
    blockAppend: () => blockAppend(),
    blockItemLabel: ({ item }) => blockItemLabel(item),
  },
});
