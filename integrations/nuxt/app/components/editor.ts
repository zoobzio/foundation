// The vue editor with each tool's icon before its label, and the label in
// the visitor's locale.
import Core from "@zoobzio/vue/components/editor.vue";

import { iconOf } from "./icon";
import { textSlot } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { toolIcon, toolText } from "../utils/editor";

export default wrap(Core, {
  slots: {
    toolPrepend: ({ tool }) => iconOf(toolIcon(tool.key)),
    toolLabel: ({ tool }) => textSlot(toolText(tool.key) ?? tool.label),
  },
});
