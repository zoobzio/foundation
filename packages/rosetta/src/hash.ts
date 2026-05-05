import { createHash } from "node:crypto";

/** Produces a stable short hash from a source string. */
export const hashText = (text: string): string =>
  createHash("sha256").update(text).digest("hex").slice(0, 12);
