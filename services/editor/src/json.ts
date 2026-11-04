import type { Codec, Doc } from "./types";

/**
 * The editor's own form, in and out: the document as tiptap's JSON.
 */
export const json: Codec<Doc> = {
  read: (source) => source,
  write: (document) => document,
};
