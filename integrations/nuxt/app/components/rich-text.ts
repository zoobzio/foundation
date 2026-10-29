// The vue rich text with each tool's icon (`toolIcon`, by the tool's
// key) before its label, as the editor draws them.
import Core from "@zoobzio/vue/components/rich-text.vue";

import { iconOf } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { toolIcon } from "../utils/editor";

export default wrap(Core, {
  slots: { toolPrepend: ({ tool }) => iconOf(toolIcon(tool.key)) },
});
