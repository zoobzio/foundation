// Constructor-injected seams: a plain state container, a vi.fn() poll, and
// vi.fn() listeners, under fake timers, so every wait is stepped through.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SyncService } from "../src/service";
import { createSyncState } from "../src/state";
import { SYNC_INTERVALS, SYNC_OFF } from "../src/constants";
import type { Actions, Change, Config, State } from "../src/types";

const START = "2026-01-01T00:00:00.000Z";

const makeService = (
  overrides: { config?: Config; state?: State; poll?: Actions["poll"] } = {},
) => {
  const config = overrides.config ?? {};
  const state = overrides.state ?? createSyncState(config);
  const poll = vi.fn(overrides.poll ?? (async () => {}));
  const service = new SyncService("test-sync", config, state, { poll });
  const changed = vi.fn();
  const synced = vi.fn();
  const failed = vi.fn();
  service.on("changed", changed);
  service.on("synced", synced);
  service.on("failed", failed);
  return { service, state, poll, changed, synced, failed };
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(START));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("interval", () => {
  it("offers the default intervals, and starts off", () => {
    const { service } = makeService();
    expect(service.intervals).toBe(SYNC_INTERVALS);
    expect(service.interval).toBe(SYNC_OFF);
    expect(service.active).toBe(false);
  });

  it("offers the config's intervals", () => {
    const { service } = makeService({ config: { intervals: [1_000] } });
    expect(service.intervals).toEqual([1_000]);
  });

  it("sets an interval it offers, and emits changed", () => {
    const { service, state, changed } = makeService();
    expect(service.setInterval(30_000)).toBe(true);
    expect(state.interval).toBe(30_000);
    expect(service.active).toBe(true);
    expect(changed).toHaveBeenCalledExactlyOnceWith({
      id: "test-sync",
      interval: 30_000,
    });
  });

  it("refuses an interval it does not offer, and the one it is on", () => {
    const { service, state, changed } = makeService();
    expect(service.setInterval(1)).toBe(false);
    expect(service.setInterval(-30_000)).toBe(false);
    expect(service.setInterval(SYNC_OFF)).toBe(false);
    expect(state.interval).toBe(SYNC_OFF);
    expect(changed).not.toHaveBeenCalled();
  });

  it("turns off from any interval", () => {
    const { service } = makeService({ config: { interval: 10_000 } });
    expect(service.setInterval(SYNC_OFF)).toBe(true);
    expect(service.active).toBe(false);
  });

  it("emits change for each write of the container", () => {
    const { service } = makeService();
    const changes: Change[] = [];
    service.on("change", (change) => changes.push(change));
    service.setInterval(10_000);
    service.mark("a");
    expect(changes).toEqual([
      { field: "interval", before: 0, after: 10_000 },
      { field: "since", before: null, after: "a" },
    ]);
  });
});

describe("mark", () => {
  it("marks now, as an ISO timestamp", () => {
    const { service } = makeService();
    service.mark();
    expect(service.since).toBe(START);
  });

  it("marks what it is given, as given", () => {
    const { service } = makeService();
    service.mark("v42");
    expect(service.since).toBe("v42");
  });
});

describe("poll", () => {
  it("hands the poll the mark, and emits synced with the one it left", async () => {
    const { service, poll, synced } = makeService({
      poll: async () => service.mark("b"),
    });
    service.mark("a");
    await service.poll();
    expect(poll).toHaveBeenCalledExactlyOnceWith("a");
    expect(synced).toHaveBeenCalledExactlyOnceWith({
      id: "test-sync",
      since: "b",
    });
  });

  it("polls nothing before a mark", async () => {
    const { service, poll } = makeService();
    await service.poll();
    expect(poll).not.toHaveBeenCalled();
  });

  it("is syncing while the poll is out, and polls one at a time", async () => {
    let settle = () => {};
    const { service, state, poll } = makeService({
      poll: () => new Promise<void>((resolve) => (settle = resolve)),
    });
    service.mark("a");
    const out = service.poll();
    expect(state.syncing).toBe(true);
    await service.poll();
    expect(poll).toHaveBeenCalledOnce();
    settle();
    await out;
    expect(state.syncing).toBe(false);
  });

  it("emits failed for a poll that rejects, and settles", async () => {
    const error = new Error("down");
    const { service, state, failed, synced } = makeService({
      poll: async () => {
        throw error;
      },
    });
    service.mark("a");
    await service.poll();
    expect(failed).toHaveBeenCalledExactlyOnceWith({ id: "test-sync", error });
    expect(synced).not.toHaveBeenCalled();
    expect(state.syncing).toBe(false);
  });

  it("emits failed for a poll that throws", async () => {
    const error = new Error("down");
    const { service, failed } = makeService({
      poll: () => {
        throw error;
      },
    });
    service.mark("a");
    await service.poll();
    expect(failed).toHaveBeenCalledExactlyOnceWith({ id: "test-sync", error });
  });
});

describe("watch", () => {
  const watched = (overrides: Parameters<typeof makeService>[0] = {}) => {
    const made = makeService({ config: { interval: 10_000 }, ...overrides });
    made.service.mark("a");
    return { ...made, stop: made.service.watch() };
  };

  it("polls on the interval while watched", async () => {
    const { poll } = watched();
    await vi.advanceTimersByTimeAsync(9_999);
    expect(poll).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(poll).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(poll).toHaveBeenCalledTimes(2);
  });

  it("polls nothing unwatched", async () => {
    const { service, poll } = makeService({ config: { interval: 10_000 } });
    service.mark("a");
    await vi.advanceTimersByTimeAsync(60_000);
    expect(poll).not.toHaveBeenCalled();
  });

  it("polls nothing while off", async () => {
    const { poll } = watched({ config: {} });
    await vi.advanceTimersByTimeAsync(600_000);
    expect(poll).not.toHaveBeenCalled();
  });

  it("stops once the watch is over, however often it is ended", async () => {
    const { poll, stop, service } = watched();
    const other = service.watch();
    stop();
    stop();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(poll).toHaveBeenCalledOnce();
    other();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(poll).toHaveBeenCalledOnce();
  });

  it("starts the wait over on a mark", async () => {
    const { service, poll } = watched();
    await vi.advanceTimersByTimeAsync(9_000);
    service.mark("b");
    await vi.advanceTimersByTimeAsync(9_000);
    expect(poll).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1_000);
    expect(poll).toHaveBeenCalledExactlyOnceWith("b");
  });

  it("starts the wait over on a change of the interval", async () => {
    const { service, poll } = watched();
    await vi.advanceTimersByTimeAsync(9_000);
    service.setInterval(30_000);
    await vi.advanceTimersByTimeAsync(29_999);
    expect(poll).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(poll).toHaveBeenCalledOnce();
    service.setInterval(SYNC_OFF);
    await vi.advanceTimersByTimeAsync(600_000);
    expect(poll).toHaveBeenCalledOnce();
  });

  it("waits a whole interval from when a poll settles", async () => {
    const { poll } = watched({
      poll: () => new Promise((resolve) => setTimeout(resolve, 4_000)),
    });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(poll).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(13_999);
    expect(poll).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1);
    expect(poll).toHaveBeenCalledTimes(2);
  });

  it("keeps its pace past a poll that fails", async () => {
    const { poll, failed } = watched({
      poll: async () => {
        throw new Error("down");
      },
    });
    await vi.advanceTimersByTimeAsync(20_000);
    expect(poll).toHaveBeenCalledTimes(2);
    expect(failed).toHaveBeenCalledTimes(2);
  });

  it("waits for the first mark", async () => {
    const { service, poll } = makeService({ config: { interval: 10_000 } });
    service.watch();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(poll).not.toHaveBeenCalled();
    service.mark("a");
    await vi.advanceTimersByTimeAsync(10_000);
    expect(poll).toHaveBeenCalledExactlyOnceWith("a");
  });

  it("a poll asked for by hand starts the wait over", async () => {
    const { service, poll } = watched();
    await vi.advanceTimersByTimeAsync(9_000);
    await service.poll();
    await vi.advanceTimersByTimeAsync(9_999);
    expect(poll).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1);
    expect(poll).toHaveBeenCalledTimes(2);
  });
});
