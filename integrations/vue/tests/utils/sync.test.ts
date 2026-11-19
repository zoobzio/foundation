import { describe, expect, it, vi } from "vitest";
import { SyncService, createSyncState } from "@zoobzio/sync";
import {
  intervalLabel,
  intervalParts,
  isSyncCurrent,
  selectSync,
  syncGroups,
} from "../../src/utils/sync";

const makeSync = (intervals?: number[]) =>
  new SyncService(
    "test-sync",
    intervals ? { intervals } : {},
    createSyncState(),
    { poll: vi.fn() },
  );

describe("intervalParts", () => {
  it("reads whole minutes as minutes and the rest as seconds", () => {
    expect(intervalParts(10_000)).toEqual({ unit: "seconds", count: 10 });
    expect(intervalParts(60_000)).toEqual({ unit: "minutes", count: 1 });
    expect(intervalParts(90_000)).toEqual({ unit: "seconds", count: 90 });
    expect(intervalParts(300_000)).toEqual({ unit: "minutes", count: 5 });
  });
});

describe("intervalLabel", () => {
  it("names an interval in words", () => {
    expect(intervalLabel(1_000)).toBe("Every second");
    expect(intervalLabel(30_000)).toBe("Every 30 seconds");
    expect(intervalLabel(60_000)).toBe("Every minute");
    expect(intervalLabel(300_000)).toBe("Every 5 minutes");
  });
});

describe("syncGroups", () => {
  it("leads with the refresh, then off and each interval", () => {
    expect(syncGroups(makeSync([5_000, 60_000]))).toEqual([
      { key: "now", items: [{ key: "now", label: "Refresh now" }] },
      {
        key: "interval",
        items: [
          { key: "off", label: "Off", interval: 0 },
          { key: "5000", label: "Every 5 seconds", interval: 5_000 },
          { key: "60000", label: "Every minute", interval: 60_000 },
        ],
      },
    ]);
  });

  it("takes its text from the labels given", () => {
    const groups = syncGroups(makeSync([5_000]), {
      now: "Reload",
      off: "Never",
      interval: (interval) => `${interval}ms`,
    });
    expect(groups.flatMap((g) => g.items.map((i) => i.label))).toEqual([
      "Reload",
      "Never",
      "5000ms",
    ]);
  });
});

describe("isSyncCurrent", () => {
  it("marks the item of the interval the sync is on", () => {
    const sync = makeSync();
    const [now, pace] = syncGroups(sync);
    const [off, ten] = pace?.items ?? [];
    if (!now?.items[0] || !off || !ten) throw new Error("missing items");
    expect(isSyncCurrent(sync, now.items[0])).toBe(false);
    expect(isSyncCurrent(sync, off)).toBe(true);
    expect(isSyncCurrent(sync, ten)).toBe(false);
    sync.setInterval(10_000);
    expect(isSyncCurrent(sync, off)).toBe(false);
    expect(isSyncCurrent(sync, ten)).toBe(true);
    expect(isSyncCurrent(undefined, ten)).toBe(false);
  });
});

describe("selectSync", () => {
  it("fetches for the item that carries no interval, and sets one that does", () => {
    const sync = makeSync();
    const fetch = vi.fn();
    selectSync(sync, { key: "now", label: "Refresh now" }, fetch);
    expect(fetch).toHaveBeenCalledOnce();
    expect(sync.interval).toBe(0);
    selectSync(sync, { key: "30000", label: "x", interval: 30_000 }, fetch);
    expect(fetch).toHaveBeenCalledOnce();
    expect(sync.interval).toBe(30_000);
  });
});
