// The vue code editor with its status line — the cursor's line and column,
// one message with its values — in the visitor's locale.
import Core from "@zoobzio/vue/components/code.vue";

import { h } from "vue";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { text } from "./text";

export default wrap(Core, {
  slots: {
    status: ({ code, settings }) => [
      h("div", { class: "f-group f-data-code-status", ...settings.status }, [
        h(
          "span",
          {
            class: "f-data-code-cursor",
            "data-line": code.cursor.line,
            "data-column": code.cursor.column,
          },
          text("code.cursor", {
            line: code.cursor.line,
            column: code.cursor.column,
          }),
        ),
      ]),
    ],
  },
});
