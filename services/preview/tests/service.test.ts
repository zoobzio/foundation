// Constructor-injected seams — a plain state container, a vi.fn() Actions
// fake, and vi.fn() listeners. Every test drives a state transition and
// asserts both the new state and the side-channel contracts (the action's
// arguments, events).
import { describe, expect, it, vi } from "vitest";
import { PreviewService } from "../src/service";
import { createPreviewState } from "../src/state";
import type { Change, Config, Options, State } from "../src/types";
import { fakeConfig, fakeRows } from "./data";
import type { FakeRow } from "./data";

const subject = fakeRows[0];
if (!subject) throw new Error("fakeRows is empty");

const makeActions = (row: FakeRow = subject) => ({
  fetch: vi.fn(async (): Promise<FakeRow> => row),
});

const makeService = (
  overrides: {
    state?: State<FakeRow>;
    actions?: ReturnType<typeof makeActions>;
    config?: Partial<Config<FakeRow>>;
    options?: Options<FakeRow>;
  } = {},
) => {
  const config = { ...fakeConfig, ...overrides.config };
  const state = overrides.state ?? createPreviewState<FakeRow>();
  const actions = overrides.actions ?? makeActions();
  const service = new PreviewService<FakeRow>(
    "test-preview",
    config,
    state,
    actions,
    overrides.options,
  );
  const loaded = vi.fn();
  service.on("loaded", loaded);
  return { service, state, actions, loaded };
};

describe("config", () => {
  it("exposes the fields and the content variant", () => {
    const { service } = makeService();
    expect(service.id).toBe("test-preview");
    expect(service.config).toEqual(fakeConfig);
    expect(service.fields).toBe(fakeConfig.fields);
    expect(service.content).toBe(fakeConfig.content);
  });
});

describe("derived", () => {
  it("contentValue and fieldValue are empty with no data", () => {
    const { service } = makeService();
    expect(service.data).toBeNull();
    expect(service.contentValue).toBe("");
    expect(service.fieldValue("name")).toBe("");
  });

  it("contentValue stringifies the content key of the record", async () => {
    const { service, state } = makeService();
    state.data = subject;
    expect(service.contentValue).toBe(subject.body);
    state.data = { ...subject, body: "" };
    expect(service.contentValue).toBe("");
  });

  it("fieldValue reads a field of the record as is", () => {
    const { service, state } = makeService();
    state.data = subject;
    expect(service.fieldValue("name")).toBe(subject.name);
    expect(service.fieldValue("id")).toBe(subject.id);
  });
});

describe("init", () => {
  it("fetches once and guards re-entry", async () => {
    const { service, actions } = makeService();
    await expect(service.init()).resolves.toBe(true);
    await expect(service.init()).resolves.toBe(true);
    expect(actions.fetch).toHaveBeenCalledTimes(1);
    expect(service.initialized).toBe(true);
    expect(service.data).toEqual(subject);
  });

  it("skips the fetch when the container is already initialized", async () => {
    const state = createPreviewState<FakeRow>();
    state.initialized = true;
    const { service, actions } = makeService({ state });
    await service.init();
    expect(actions.fetch).not.toHaveBeenCalled();
  });
});

describe("fetch", () => {
  it("passes the service to the action and applies the record", async () => {
    const { service, actions } = makeService();
    await service.fetch();
    expect(actions.fetch).toHaveBeenCalledWith(service);
    expect(service.data).toEqual(subject);
  });

  it("holds loading during flight and clears it after", async () => {
    const box: { resolve?: (row: FakeRow) => void } = {};
    const actions = makeActions();
    actions.fetch.mockImplementationOnce(
      () =>
        new Promise<FakeRow>((res) => {
          box.resolve = res;
        }),
    );
    const { service } = makeService({ actions });

    const flight = service.fetch();
    expect(service.loading).toBe(true);
    box.resolve?.(subject);
    await flight;
    expect(service.loading).toBe(false);
  });

  it("emits loaded after the record lands", async () => {
    const { service, loaded } = makeService();
    loaded.mockImplementation(() => {
      expect(service.data).toEqual(subject);
      expect(service.loading).toBe(false);
    });
    await service.fetch();
    expect(loaded).toHaveBeenCalledWith({ id: "test-preview" });
  });

  it("clears loading and still emits when the action throws", async () => {
    const actions = makeActions();
    actions.fetch.mockRejectedValueOnce(new Error("boom"));
    const { service, loaded } = makeService({ actions });

    await expect(service.fetch()).rejects.toThrow("boom");
    expect(service.loading).toBe(false);
    expect(service.data).toBeNull();
    expect(loaded).toHaveBeenCalledWith({ id: "test-preview" });
  });

  it("replaces a previous record", async () => {
    const other = fakeRows[1];
    if (!other) throw new Error("fakeRows has one row");
    const { service, actions } = makeService();
    await service.fetch();
    actions.fetch.mockResolvedValueOnce(other);
    await service.fetch();
    expect(service.data).toEqual(other);
  });
});

describe("events", () => {
  it("emits change for every field write, in order", async () => {
    const { service } = makeService();
    const changes: Change<FakeRow>[] = [];
    service.on("change", (change) => changes.push(change));
    await service.init();
    expect(changes).toEqual([
      { field: "initialized", before: false, after: true },
      { field: "loading", before: false, after: true },
      { field: "data", before: null, after: subject },
      { field: "loading", before: true, after: false },
    ]);
  });

  it("on returns an unsubscribe function", async () => {
    const { service, loaded } = makeService();
    const extra = vi.fn();
    const off = service.on("loaded", extra);
    off();
    await service.fetch();
    expect(loaded).toHaveBeenCalledOnce();
    expect(extra).not.toHaveBeenCalled();
  });
});

describe("middleware", () => {
  it("set middleware shapes the stored value", async () => {
    const { service, state } = makeService({
      options: {
        set: {
          state: {
            data: (data) =>
              data ? { ...data, name: data.name.toUpperCase() } : null,
          },
        },
      },
    });
    await service.fetch();
    expect(state.data?.name).toBe("ALICE");
    expect(service.data?.name).toBe("ALICE");
  });

  it("get middleware shapes the read value", () => {
    const { service, state } = makeService({
      options: {
        get: {
          state: {
            data: (data) => (data ? { ...data, status: "Seen" } : null),
          },
        },
      },
    });
    state.data = subject;
    expect(service.data?.status).toBe("Seen");
    expect(service.fieldValue("status")).toBe("Seen");
    expect(state.data.status).toBe(subject.status);
  });
});
