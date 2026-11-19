// The sync glue of the wrappers: the items of the menu behind a table's or
// a browser's refresh, where it has a sync, in the visitor's locale, and
// the `check` icon after the item of the interval the sync is on. It sits
// with the wrappers because it resolves text and names `Icon`, which only
// they may.
import type { SyncItem } from "@zoobzio/vue/types/components/sync";
import type { Service } from "@zoobzio/sync";
import type { VNode } from "vue";

import { SYNC_NOW_KEY, SYNC_OFF_KEY } from "@zoobzio/vue/constants/sync";
import { intervalParts, isSyncCurrent } from "@zoobzio/vue/utils/sync";
import { h } from "vue";
import { icon } from "./icon";
import { text } from "./text";

/**
 * The text of a sync menu's item: the refresh, off, or the interval the
 * item carries, in seconds or in whole minutes.
 */
const syncText = (item: SyncItem): string => {
  if (item.key === SYNC_NOW_KEY) return text("sync.now");
  if (item.key === SYNC_OFF_KEY) return text("sync.off");
  if (item.interval === undefined) return text(item.label);
  const { unit, count } = intervalParts(item.interval);
  return unit === "minutes"
    ? text("sync.minutes", { count })
    : text("sync.seconds", { count });
};

/** An item's label, as the default of a `syncLabel` slot. */
export const syncLabel = (item: SyncItem): VNode[] => [
  h("span", { class: "f-span" }, syncText(item)),
];

/**
 * The mark of the interval the sync is on, as the default of a
 * `syncAppend` slot: nothing after any other item.
 */
export const syncMark = (sync: Service | undefined, item: SyncItem): VNode[] =>
  isSyncCurrent(sync, item) ? [icon("check")] : [];
