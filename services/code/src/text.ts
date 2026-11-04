import type { Codec, Doc } from "./types";

/**
 * The editor's own form, in and out: the document as text.
 */
export const text: Codec<Doc> = {
  read: (source) => source,
  write: (document) => document,
};
