import type { Context } from "../src/types";
import type { JSONContent } from "@tiptap/core";

import { getSchema } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";

/** The context of an editor over the default feature set. */
export const context = (): Context => {
  const extensions = [StarterKit];
  return { schema: getSchema(extensions), extensions };
};

export const document: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Title" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "A " },
        { type: "text", text: "bold", marks: [{ type: "bold" }] },
        { type: "text", text: " word and " },
        { type: "text", text: "code", marks: [{ type: "code" }] },
        { type: "text", text: "." },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            { type: "paragraph", content: [{ type: "text", text: "one" }] },
          ],
        },
        {
          type: "listItem",
          content: [
            { type: "paragraph", content: [{ type: "text", text: "two" }] },
          ],
        },
      ],
    },
  ],
};
