import type { Codec, Config, Doc } from "../src/types";

/** The editor's own form in and out: the trivial seam the tests drive. */
export const passthrough: Codec<Doc> = {
  read: (source) => source,
  write: (document) => document,
};

export const fakeConfig: Config = {};

export const hello = "Hello world";

export const lines = "one\ntwo\nthree";
