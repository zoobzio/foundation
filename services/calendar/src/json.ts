import type { Codec, Doc } from "./types";

/**
 * The calendar's own form, in and out: JSCalendar entries.
 */
export const json: Codec<Doc> = {
  read: (source) => source,
  write: (entries) => entries,
};
