import type { MenuGroup } from "../types/components/menu";
import type { SyncItem, SyncLabels } from "../types/components/sync";
import type { Service } from "@zoobzio/sync";

import { SYNC_OFF } from "@zoobzio/sync";
import {
  SYNC_NOW_KEY,
  SYNC_NOW_LABEL,
  SYNC_OFF_KEY,
  SYNC_OFF_LABEL,
} from "../constants/sync";

const SECOND = 1_000;
const MINUTE = 60 * SECOND;

/**
 * An interval as its two parts: whole minutes where it is a number of
 * them, seconds otherwise.
 */
export const intervalParts = (
  interval: number,
): { unit: "seconds" | "minutes"; count: number } =>
  interval >= MINUTE && interval % MINUTE === 0
    ? { unit: "minutes", count: interval / MINUTE }
    : { unit: "seconds", count: Math.round(interval / SECOND) };

/**
 * An interval in words: `Every 30 seconds`, `Every minute`.
 */
export const intervalLabel = (interval: number): string => {
  const { unit, count } = intervalParts(interval);
  const one = unit === "minutes" ? "minute" : "second";
  return count === 1 ? `Every ${one}` : `Every ${count} ${one}s`;
};

/** The text of a sync menu's items where a view names none. */
export const SYNC_LABELS: SyncLabels = {
  now: SYNC_NOW_LABEL,
  off: SYNC_OFF_LABEL,
  interval: intervalLabel,
};

/**
 * A sync as the groups of its menu: the item that refreshes now, then the
 * pace, off and each interval the sync offers.
 */
export const syncGroups = (
  sync: Service,
  labels: SyncLabels = SYNC_LABELS,
): MenuGroup<SyncItem>[] => [
  { key: "now", items: [{ key: SYNC_NOW_KEY, label: labels.now }] },
  {
    key: "interval",
    items: [
      { key: SYNC_OFF_KEY, label: labels.off, interval: SYNC_OFF },
      ...sync.intervals.map((interval) => ({
        key: String(interval),
        label: labels.interval(interval),
        interval,
      })),
    ],
  },
];

/**
 * Whether an item is the pace the sync is on: what a view marks as the
 * current one.
 */
export const isSyncCurrent = (sync: Service | undefined, item: SyncItem) =>
  item.interval !== undefined && item.interval === sync?.interval;

/**
 * Carries out an item of a sync menu: sets the interval it carries, or,
 * where it carries none, refreshes at once through `fetch`, the whole
 * fetch of the service the sync belongs to.
 */
export const selectSync = (
  sync: Service,
  item: SyncItem,
  fetch: () => unknown,
): void => {
  if (item.interval === undefined) void fetch();
  else sync.setInterval(item.interval);
};
