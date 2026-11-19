import type { MenuItem } from "./menu";
import type { Text } from "@zoobzio/kit";

/**
 * An item of a sync menu. `now` refreshes at once; every other sets the
 * interval it carries, `off` the one of a sync that does not poll. An
 * item's key is `now`, `off`, or its interval in milliseconds, as text.
 */
export interface SyncItem extends MenuItem {
  key: string;
  interval?: number;
}

/**
 * The text of a sync menu's items: the one that refreshes now, the one
 * that turns the sync off, and an interval's, from its milliseconds.
 */
export type SyncLabels = {
  now: Text;
  off: Text;
  interval: (interval: number) => Text;
};
