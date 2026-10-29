// The vue editor with each tool's icon (`toolIcon`, by the tool's
// key) before its label.
import Core from "@zoobzio/vue/components/editor.vue";

import { iconOf } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { toolIcon } from "../utils/editor";

export default wrap(Core, {
  slots: { toolPrepend: ({ tool }) => iconOf(toolIcon(tool.key)) },
});
