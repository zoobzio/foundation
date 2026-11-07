// The vue rich text as an icon toolbar, as the editor: each tool draws its
// icon in place of its label, the label, in the visitor's locale, stays
// the button's accessible name and its tooltip, and the block type
// dropdown reads in the visitor's locale.
import type { RichTextPassthrough } from "@zoobzio/vue/types/components/rich-text";

import Core from "@zoobzio/vue/components/rich-text.vue";

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
  pt: (pt) => layer<RichTextPassthrough>(pt, { tool: toolLayer }),
  slots: {
    toolLabel: ({ tool }) => toolLabel(tool),
    blockLabel: ({ block }) => blockLabel(block),
    blockAppend: () => blockAppend(),
    blockItemLabel: ({ item }) => blockItemLabel(item),
  },
});
