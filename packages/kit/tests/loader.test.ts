import { describe, expect, it, vi } from "vitest";
import { makeLoader } from "../src/loader";
import type { LoaderActions, LoaderState } from "../src/types";

type Params = { page: number };
type Result = { rows: string[]; since?: string };

/** A promise settled from outside, so a test orders what comes back. */
const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const setup = (actions: Partial<LoaderActions<Params, Result>> = {}) => {
  const state: LoaderState & { rows: string[]; page: number } = {
    loading: false,
    initialized: false,
    since: null,
    rows: [],
    page: 0,
  };
  const settled = vi.fn();
  const fetch = vi.fn(async ({ page }: Params): Promise<Result> => ({
    rows: [`page ${page}`],
  }));
  const loader = makeLoader<Params, Result>(state, {
    params: () => ({ page: state.page }),
    fetch,
    land: (result, at) => {
      state.rows = result.rows;
      state.since = result.since ?? at;
    },
    settled,
    ...actions,
  });
  return { state, loader, fetch, settled };
};

describe("makeLoader", () => {
  describe("init", () => {
    it("fetches once", async () => {
      const { state, loader, fetch } = setup();
      expect(await loader.init()).toBe(true);
      expect(await loader.init()).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(state.initialized).toBe(true);
      expect(state.rows).toEqual(["page 0"]);
    });
  });

  describe("fetch", () => {
    it("holds loading while it is out, lands, and settles", async () => {
      const out = deferred<Result>();
      const { state, loader, settled } = setup({ fetch: () => out.promise });
      const done = loader.fetch();
      expect(state.loading).toBe(true);
      out.resolve({ rows: ["a"] });
      await done;
      expect(state.loading).toBe(false);
      expect(state.rows).toEqual(["a"]);
      expect(settled).toHaveBeenCalledExactlyOnceWith({ page: 0 });
    });

    it("marks with the time the request was made", async () => {
      const now = vi
        .fn()
        .mockReturnValueOnce(new Date("2026-01-01T00:00:00Z"))
        .mockReturnValue(new Date("2026-01-01T00:00:09Z"));
      const { state, loader } = setup({ now });
      await loader.fetch();
      expect(state.since).toBe("2026-01-01T00:00:00.000Z");
    });

    it("settles and rejects where the fetch fails", async () => {
      const { state, loader, settled } = setup({
        fetch: () => Promise.reject(new Error("down")),
      });
      await expect(loader.fetch()).rejects.toThrow("down");
      expect(state.loading).toBe(false);
      expect(state.rows).toEqual([]);
      expect(settled).toHaveBeenCalledTimes(1);
    });

    it("drops a fetch that settles after a later one began", async () => {
      const first = deferred<Result>();
      const second = deferred<Result>();
      const fetch = vi
        .fn()
        .mockReturnValueOnce(first.promise)
        .mockReturnValueOnce(second.promise);
      const { state, loader, settled } = setup({ fetch });
      const one = loader.fetch();
      state.page = 1;
      const two = loader.fetch();

      second.resolve({ rows: ["second"] });
      await two;
      first.resolve({ rows: ["first"] });
      await one;

      expect(state.rows).toEqual(["second"]);
      expect(settled).toHaveBeenCalledExactlyOnceWith({ page: 1 });
    });

    it("leaves loading to the later fetch", async () => {
      const first = deferred<Result>();
      const second = deferred<Result>();
      const fetch = vi
        .fn()
        .mockReturnValueOnce(first.promise)
        .mockReturnValueOnce(second.promise);
      const { state, loader } = setup({ fetch });
      const one = loader.fetch();
      const two = loader.fetch();

      first.reject(new Error("late"));
      await expect(one).rejects.toThrow("late");
      expect(state.loading).toBe(true);

      second.resolve({ rows: ["second"] });
      await two;
      expect(state.loading).toBe(false);
    });
  });

  describe("refresh", () => {
    it("does nothing without a refresh", async () => {
      const { loader, fetch } = setup();
      await loader.init();
      await loader.refresh("then");
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("asks nothing before the first fetch, or while one is out", async () => {
      const out = deferred<Result>();
      const refresh = vi.fn();
      const { loader } = setup({ refresh, fetch: () => out.promise });
      await loader.refresh("then");
      const done = loader.init();
      await loader.refresh("then");
      expect(refresh).not.toHaveBeenCalled();
      out.resolve({ rows: [] });
      await done;
    });

    it("asks nothing while the owner is busy", async () => {
      const refresh = vi.fn();
      const { loader } = setup({ refresh, busy: () => true });
      await loader.init();
      await loader.refresh("then");
      expect(refresh).not.toHaveBeenCalled();
    });

    it("is handed the params and the mark", async () => {
      const refresh = vi.fn();
      const { state, loader } = setup({ refresh });
      await loader.init();
      const since = state.since ?? "";
      await loader.refresh(since);
      expect(refresh).toHaveBeenCalledExactlyOnceWith({ page: 0 }, since);
    });

    it.each([undefined, null, false])(
      "keeps what is held on %s",
      async (answer) => {
        const { state, loader, settled } = setup({ refresh: () => answer });
        await loader.init();
        const since = state.since ?? "";
        await loader.refresh(since);
        expect(state.rows).toEqual(["page 0"]);
        expect(state.since).toBe(since);
        expect(settled).toHaveBeenCalledTimes(1);
      },
    );

    it("lands a result quietly", async () => {
      const out = deferred<Result>();
      const { state, loader, settled } = setup({ refresh: () => out.promise });
      await loader.init();
      const done = loader.refresh(state.since ?? "");
      expect(state.loading).toBe(false);
      out.resolve({ rows: ["fresh"], since: "mark" });
      await done;
      expect(state.rows).toEqual(["fresh"]);
      expect(state.since).toBe("mark");
      expect(settled).toHaveBeenCalledTimes(2);
    });

    it("fetches again on true, with the params it asked with", async () => {
      const { state, loader, fetch } = setup({ refresh: () => true });
      await loader.init();
      fetch.mockResolvedValueOnce({ rows: ["again"] });
      await loader.refresh(state.since ?? "");
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith({ page: 0 });
      expect(state.rows).toEqual(["again"]);
      expect(state.loading).toBe(false);
    });

    it("drops a result where a fetch began since", async () => {
      const out = deferred<Result>();
      const { state, loader } = setup({ refresh: () => out.promise });
      await loader.init();
      const done = loader.refresh(state.since ?? "");
      state.page = 1;
      await loader.fetch();
      out.resolve({ rows: ["stale"] });
      await done;
      expect(state.rows).toEqual(["page 1"]);
    });

    it("drops a result where the mark moved since", async () => {
      const out = deferred<Result>();
      const { state, loader } = setup({ refresh: () => out.promise });
      await loader.init();
      const done = loader.refresh(state.since ?? "");
      state.since = "moved";
      out.resolve({ rows: ["stale"] });
      await done;
      expect(state.rows).toEqual(["page 0"]);
    });

    it("drops a result where the owner became busy since", async () => {
      const out = deferred<Result>();
      let busy = false;
      const { state, loader } = setup({
        refresh: () => out.promise,
        busy: () => busy,
      });
      await loader.init();
      const done = loader.refresh(state.since ?? "");
      busy = true;
      out.resolve({ rows: ["stale"] });
      await done;
      expect(state.rows).toEqual(["page 0"]);
    });

    it("drops a result where the owner's version moved since", async () => {
      const out = deferred<Result>();
      let version = 0;
      const { state, loader } = setup({
        refresh: () => out.promise,
        version: () => version,
      });
      await loader.init();
      const done = loader.refresh(state.since ?? "");
      version += 1;
      out.resolve({ rows: ["stale"] });
      await done;
      expect(state.rows).toEqual(["page 0"]);
    });
  });

  describe("load", () => {
    it("lands a result with no fetch", () => {
      const { state, loader, fetch, settled } = setup();
      loader.load({ rows: ["given"] });
      expect(fetch).not.toHaveBeenCalled();
      expect(state.rows).toEqual(["given"]);
      expect(state.initialized).toBe(true);
      expect(state.loading).toBe(false);
      expect(settled).toHaveBeenCalledExactlyOnceWith({ page: 0 });
    });

    it("drops a fetch that is out", async () => {
      const out = deferred<Result>();
      const { state, loader } = setup({ fetch: () => out.promise });
      const done = loader.fetch();
      loader.load({ rows: ["given"] });
      expect(state.loading).toBe(false);
      out.resolve({ rows: ["stale"] });
      await done;
      expect(state.rows).toEqual(["given"]);
    });
  });
});
