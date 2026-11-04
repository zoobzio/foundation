import type { Codec, Config } from "../src/types";
import type { JSONContent } from "@tiptap/core";

/** The editor's own form in and out: the trivial seam the tests drive. */
export const passthrough: Codec<JSONContent> = {
  read: (source) => source,
  write: (document) => document,
};

export const fakeConfig: Config = {};

export const paragraph = (text: string): JSONContent => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});

export const doc = (...content: JSONContent[]): JSONContent => ({
  type: "doc",
  content,
});

export const hello = doc(paragraph("Hello world"));
