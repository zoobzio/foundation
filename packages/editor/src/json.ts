import type { Codec } from "./types";
import type { JSONContent } from "@tiptap/core";

/**
 * The editor's own form, in and out: the document as tiptap's JSON.
 */
export const json: Codec<JSONContent> = {
  read: (source) => source,
  write: (document) => document,
};
