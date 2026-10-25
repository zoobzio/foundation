import type { Codec, Doc } from "@zoobzio/code";

/** The editor's own form in and out: the trivial seam the tests drive. */
export const passthrough: Codec<Doc> = {
  read: (source) => source,
  write: (document) => document,
};

export const hello = "Hello world";
