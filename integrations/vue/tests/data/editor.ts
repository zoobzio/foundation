import type { Codec, Doc } from "@zoobzio/editor";

/** The editor's own form in and out: the trivial seam the tests drive. */
export const passthrough: Codec<Doc> = {
  read: (source) => source,
  write: (document) => document,
};

export const paragraph = (text: string): Doc => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});

export const hello: Doc = {
  type: "doc",
  content: [paragraph("Hello world")],
};
