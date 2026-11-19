import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, shallowRef } from "vue";
import { SyncService, createSyncState } from "@zoobzio/sync";
import { useSync } from "../../src/composables/sync";
import { withSetup } from "#test/mount/composable";

const makeSync = () => {
  const poll = vi.fn(async () => {});
  const sync = new SyncService(
    "test-sync",
    {},
    createSyncState({ interval: 10_000 }),
    { poll },
  );
  sync.mark("a");
  return { sync, poll };
};

const show = (hidden: boolean) => {
  vi.spyOn(document, "hidden", "get").mockReturnValue(hidden);
  document.dispatchEvent(new Event("visibilitychange"));
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("useSync", () => {
  it("watches the sync from mount to unmount", async () => {
    const { sync, poll } = makeSync();
    const { app } = withSetup(() => useSync(sync));
    await vi.advanceTimersByTimeAsync(10_000);
    expect(poll).toHaveBeenCalledOnce();
    app.unmount();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(poll).toHaveBeenCalledOnce();
  });

  it("leaves a service with no sync alone", () => {
    const { app } = withSetup(() => useSync(() => undefined));
    show(false);
    app.unmount();
  });

  it("rests while the document is hidden, and polls at once when it is back", async () => {
    const { sync, poll } = makeSync();
    const { app } = withSetup(() => useSync(sync));
    show(true);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(poll).not.toHaveBeenCalled();
    show(false);
    await vi.advanceTimersByTimeAsync(0);
    expect(poll).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(poll).toHaveBeenCalledTimes(2);
    app.unmount();
  });

  it("polls nothing on the way back while the sync is off", async () => {
    const { sync, poll } = makeSync();
    sync.setInterval(0);
    const { app } = withSetup(() => useSync(sync));
    show(true);
    show(false);
    await vi.advanceTimersByTimeAsync(0);
    expect(poll).not.toHaveBeenCalled();
    app.unmount();
  });

  it("does not watch a document mounted hidden until it shows", async () => {
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    const { sync, poll } = makeSync();
    const { app } = withSetup(() => useSync(sync));
    await vi.advanceTimersByTimeAsync(60_000);
    expect(poll).not.toHaveBeenCalled();
    app.unmount();
  });

  it("follows its source to another sync", async () => {
    const first = makeSync();
    const second = makeSync();
    const source = shallowRef(first.sync);
    const { app } = withSetup(() => useSync(source));
    source.value = second.sync;
    await nextTick();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(first.poll).not.toHaveBeenCalled();
    expect(second.poll).toHaveBeenCalledOnce();
    app.unmount();
  });
});
