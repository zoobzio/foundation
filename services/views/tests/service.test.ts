// Constructor-injected seams: a plain state container, a fake target the
// `read` and `apply` actions close over, vi.fn() storage, and vi.fn()
// listeners. Every test drives a transition and asserts the new state and
// the side channels (action calls, events).
import { describe, expect, it, vi } from "vitest";
import { ViewsService } from "../src/service";
import { createViewsState } from "../src/state";
import type { Actions, Config, Options, State } from "../src/types";
import { all, fakeConfig, mine, recent } from "./data";
import type { Payload } from "./data";

const makeService = (
  overrides: {
    config?: Partial<Config<Payload>>;
    actions?: Partial<Actions<Payload>>;
    options?: Options<Payload>;
    state?: State<Payload>;
  } = {},
) => {
  const config = { ...fakeConfig, ...overrides.config };
  const state = overrides.state ?? createViewsState(config);
  // The target: whatever the views are over. It starts off the views.
  const target = { live: { sort: "id", size: 5, hidden: [] } as Payload };
  const apply = vi.fn((payload: Payload) => {
    target.live = payload;
  });
  const save = vi.fn(async () => {});
  const remove = vi.fn(async () => {});
  const actions: Actions<Payload> = {
    read: () => target.live,
    apply,
    save,
    remove,
    key: () => "new",
    ...overrides.actions,
  };
  const service = new ViewsService(
    "test-views",
    config,
    state,
    actions,
    overrides.options,
  );
  const events = {
    initialized: vi.fn(),
    selected: vi.fn(),
    saved: vi.fn(),
    renamed: vi.fn(),
    removed: vi.fn(),
    reverted: vi.fn(),
    failed: vi.fn(),
  };
  service.on("initialized", events.initialized);
  service.on("selected", events.selected);
  service.on("saved", events.saved);
  service.on("renamed", events.renamed);
  service.on("removed", events.removed);
  service.on("reverted", events.reverted);
  service.on("failed", events.failed);
  const edit = (patch: Partial<Payload>) => {
    target.live = { ...target.live, ...patch };
  };
  return { service, state, target, apply, save, remove, events, edit };
};

/** A service past `init`, with the user's view stored. */
const ready = async (overrides: Parameters<typeof makeService>[0] = {}) => {
  const made = makeService({
    ...overrides,
    actions: { load: async () => [mine], ...overrides.actions },
  });
  await made.service.init();
  made.apply.mockClear();
  return made;
};

describe("init", () => {
  it("applies the active view and emits initialized", async () => {
    const { service, apply, target, events } = makeService();
    expect(service.drifted).toBe(false);
    expect(await service.init()).toBe(true);
    expect(apply).toHaveBeenCalledWith(all.payload);
    expect(target.live).toEqual(all.payload);
    expect(service.initialized).toBe(true);
    expect(service.loading).toBe(false);
    expect(service.current?.id).toBe("all");
    expect(service.drifted).toBe(false);
    expect(events.initialized).toHaveBeenCalledOnce();
  });

  it("runs once", async () => {
    const { service, apply } = makeService();
    await service.init();
    await service.init();
    expect(apply).toHaveBeenCalledOnce();
  });

  it("hands the target a payload of its own", async () => {
    const { service, target, state } = makeService();
    await service.init();
    expect(target.live).not.toBe(state.views[0]?.payload);
  });

  it("lays the stored views over the config's", async () => {
    const renamed = { ...all, name: "Everything", origin: "system" };
    const { service } = makeService({
      actions: { load: async () => [mine, renamed, "junk", { id: 1 }] },
    });
    await service.init();
    expect(service.views.map((view) => view.name)).toEqual([
      "Everything",
      "Recent",
      "Mine",
    ]);
    expect(service.views[2]?.origin).toBe("user");
  });

  it("sets a stored view the schema rejects aside as stale", async () => {
    const old = { id: "old", name: "Old", payload: { size: "ten" } };
    const { service } = makeService({ actions: { load: async () => [old] } });
    await service.init();
    expect(service.views).toHaveLength(2);
    expect(service.stale).toEqual([{ ...old, origin: "user" }]);
  });

  it("starts on a stored view the config names", async () => {
    const { service, target } = makeService({
      config: { initial: "mine" },
      actions: { load: async () => [mine] },
    });
    await service.init();
    expect(service.active).toBe("mine");
    expect(target.live).toEqual(mine.payload);
  });

  it("falls back to the first view, or none", async () => {
    const lost = makeService({ config: { initial: "gone" } });
    await lost.service.init();
    expect(lost.service.active).toBe("all");

    const empty = makeService({ config: { views: [] } });
    await empty.service.init();
    expect(empty.service.active).toBeNull();
    expect(empty.apply).not.toHaveBeenCalled();
    expect(empty.service.drifted).toBe(false);
    expect(empty.service.editable).toBe(false);
  });

  it("emits failed and rethrows when the load throws", async () => {
    const cause = new Error("offline");
    const { service, events } = makeService({
      actions: {
        load: async () => {
          throw cause;
        },
      },
    });
    await expect(service.init()).rejects.toBe(cause);
    expect(events.failed).toHaveBeenCalledWith({
      id: "test-views",
      stage: "init",
      cause,
    });
    expect(service.initialized).toBe(false);
    expect(service.loading).toBe(false);
  });
});

describe("drifted", () => {
  it("follows the target off the active view and back", async () => {
    const { service, edit } = await ready();
    edit({ size: 25 });
    expect(service.drifted).toBe(true);
    expect(service.payload.size).toBe(25);
    edit({ size: 10 });
    expect(service.drifted).toBe(false);
  });

  it("reads the target through the schema", async () => {
    const { service, target } = await ready();
    // A default the target leaves out is no edit.
    target.live = { sort: null, size: 10 } as Payload;
    expect(service.drifted).toBe(false);
    target.live = { size: "ten" } as unknown as Payload;
    expect(service.drifted).toBe(true);
  });

  it("uses the config's equality", async () => {
    const { service, edit } = await ready({
      config: { equals: (a, b) => a.sort === b.sort },
    });
    edit({ size: 99 });
    expect(service.drifted).toBe(false);
    edit({ sort: "name" });
    expect(service.drifted).toBe(true);
  });
});

describe("select", () => {
  it("applies the view and makes it active", async () => {
    const { service, target, events } = await ready();
    expect(await service.select("recent")).toBe(true);
    expect(service.active).toBe("recent");
    expect(target.live).toEqual(recent.payload);
    expect(service.drifted).toBe(false);
    expect(events.selected).toHaveBeenCalledWith({
      id: "test-views",
      view: service.current,
      from: "all",
    });
  });

  it("ignores the active view and an unknown one", async () => {
    const { service, apply } = await ready();
    expect(await service.select("all")).toBe(false);
    expect(await service.select("gone")).toBe(false);
    expect(apply).not.toHaveBeenCalled();
  });

  it("holds the selection while the active view has drifted", async () => {
    const { service, edit, apply, events } = await ready();
    edit({ size: 25 });
    expect(await service.select("recent")).toBe(false);
    expect(service.pending).toEqual({ kind: "select", id: "recent" });
    expect(service.active).toBe("all");
    expect(apply).not.toHaveBeenCalled();
    expect(events.selected).not.toHaveBeenCalled();
  });

  it("selects over the edits when forced", async () => {
    const { service, edit } = await ready();
    edit({ size: 25 });
    expect(await service.select("recent", { force: true })).toBe(true);
    expect(service.pending).toBeNull();
    expect(service.drifted).toBe(false);
  });

  it("stays put when the apply throws", async () => {
    const cause = new Error("no");
    const { service, apply, events } = await ready();
    apply.mockImplementationOnce(() => {
      throw cause;
    });
    await expect(service.select("recent")).rejects.toBe(cause);
    expect(service.active).toBe("all");
    expect(events.failed).toHaveBeenCalledWith({
      id: "test-views",
      stage: "apply",
      cause,
    });
  });
});

describe("save", () => {
  it("stores the edits on the user's view", async () => {
    const { service, edit, save, events } = await ready();
    await service.select("mine");
    edit({ size: 5 });
    await service.save();
    const view = { ...mine, payload: { ...mine.payload, size: 5 } };
    expect(save).toHaveBeenCalledWith(view, service);
    expect(service.current).toEqual(view);
    expect(service.drifted).toBe(false);
    expect(service.saving).toBe(false);
    expect(events.saved).toHaveBeenCalledWith({
      id: "test-views",
      view,
      created: false,
    });
  });

  it("refuses a system view and no view", async () => {
    const { service, save } = await ready();
    expect(service.editable).toBe(false);
    await expect(service.save()).rejects.toThrow("cannot be saved");
    expect(save).not.toHaveBeenCalled();
  });

  it("keeps the view as it was when the storage throws", async () => {
    const cause = new Error("offline");
    const { service, edit, save, events } = await ready();
    await service.select("mine");
    edit({ size: 5 });
    save.mockRejectedValueOnce(cause);
    await expect(service.save()).rejects.toBe(cause);
    expect(service.current).toEqual(mine);
    expect(service.drifted).toBe(true);
    expect(service.saving).toBe(false);
    expect(events.failed).toHaveBeenCalledWith({
      id: "test-views",
      stage: "save",
      cause,
    });
  });

  it("works with no storage", async () => {
    const { service, edit } = await ready({
      actions: { save: undefined, remove: undefined },
    });
    await service.select("mine");
    edit({ size: 5 });
    await service.save();
    expect(service.current?.payload.size).toBe(5);
  });
});

describe("saveAs", () => {
  it("stores the payload as a new view and makes it active", async () => {
    const { service, edit, save, apply, events } = await ready();
    edit({ size: 25 });
    const view = await service.saveAs("  Big pages ");
    expect(view).toEqual({
      id: "new",
      name: "Big pages",
      origin: "user",
      payload: { ...all.payload, size: 25 },
    });
    expect(save).toHaveBeenCalledWith(view, service);
    expect(service.views.at(-1)).toEqual(view);
    expect(service.active).toBe("new");
    expect(service.drifted).toBe(false);
    expect(service.editable).toBe(true);
    // The target already holds the payload: nothing to apply.
    expect(apply).not.toHaveBeenCalled();
    expect(events.saved).toHaveBeenCalledWith({
      id: "test-views",
      view,
      created: true,
    });
    expect(events.selected).toHaveBeenCalledWith({
      id: "test-views",
      view,
      from: "all",
    });
    // The system view it came from is as it was.
    expect(service.views[0]?.payload).toEqual(all.payload);
  });

  it("needs a name", async () => {
    const { service, save } = await ready();
    await expect(service.saveAs("  ")).rejects.toThrow("needs a name");
    expect(save).not.toHaveBeenCalled();
  });

  it("generates an id by default", async () => {
    const { service } = await ready({ actions: { key: undefined } });
    const view = await service.saveAs("Copy");
    expect(view.id).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe("rename", () => {
  it("stores the new name", async () => {
    const { service, save, events } = await ready();
    await service.rename("mine", " Ours ");
    const view = { ...mine, name: "Ours" };
    expect(save).toHaveBeenCalledWith(view, service);
    expect(service.views.at(-1)).toEqual(view);
    expect(events.renamed).toHaveBeenCalledWith({ id: "test-views", view });
  });

  it("does nothing for the name it has", async () => {
    const { service, save } = await ready();
    await service.rename("mine", "Mine");
    expect(save).not.toHaveBeenCalled();
  });

  it("refuses a system view, an unknown view, and an empty name", async () => {
    const { service } = await ready();
    await expect(service.rename("all", "x")).rejects.toThrow("renamed");
    await expect(service.rename("gone", "x")).rejects.toThrow("renamed");
    await expect(service.rename("mine", "")).rejects.toThrow("needs a name");
  });

  it("emits failed under its own stage", async () => {
    const cause = new Error("offline");
    const { service, save, events } = await ready();
    save.mockRejectedValueOnce(cause);
    await expect(service.rename("mine", "Ours")).rejects.toBe(cause);
    expect(events.failed).toHaveBeenCalledWith({
      id: "test-views",
      stage: "rename",
      cause,
    });
    expect(service.views.at(-1)?.name).toBe("Mine");
  });
});

describe("remove", () => {
  it("holds the removal until it is resolved", async () => {
    const { service, remove } = await ready();
    await service.remove("mine");
    expect(service.pending).toEqual({ kind: "remove", id: "mine" });
    expect(remove).not.toHaveBeenCalled();
    expect(service.views).toHaveLength(3);
  });

  it("deletes a view that is not active and stays put", async () => {
    const { service, remove, apply, events } = await ready();
    await service.remove("mine", { force: true });
    expect(remove).toHaveBeenCalledWith(mine, service);
    expect(service.views.map((view) => view.id)).toEqual(["all", "recent"]);
    expect(service.active).toBe("all");
    expect(apply).not.toHaveBeenCalled();
    expect(events.removed).toHaveBeenCalledWith({
      id: "test-views",
      view: mine,
    });
  });

  it("selects the first view left after the active one goes", async () => {
    const { service, target, events } = await ready();
    await service.select("mine");
    await service.remove("mine", { force: true });
    expect(service.active).toBe("all");
    expect(target.live).toEqual(all.payload);
    expect(events.selected).toHaveBeenLastCalledWith({
      id: "test-views",
      view: service.current,
      from: "mine",
    });
  });

  it("leaves no active view when the last one goes", async () => {
    const { service } = await ready({ config: { views: [] } });
    expect(service.active).toBe("mine");
    await service.remove("mine", { force: true });
    expect(service.active).toBeNull();
    expect(service.views).toEqual([]);
  });

  it("deletes a stale view", async () => {
    const old = { id: "old", name: "Old", payload: { size: "ten" } };
    const { service, remove } = await ready({
      actions: { load: async () => [old] },
    });
    await service.remove("old", { force: true });
    expect(remove).toHaveBeenCalledWith({ ...old, origin: "user" }, service);
    expect(service.stale).toEqual([]);
    expect(service.views).toHaveLength(2);
  });

  it("refuses a system view and an unknown one", async () => {
    const { service } = await ready();
    await expect(service.remove("all")).rejects.toThrow("removed");
    await expect(service.remove("gone")).rejects.toThrow("removed");
    expect(service.pending).toBeNull();
  });

  it("keeps the view when the storage throws", async () => {
    const cause = new Error("offline");
    const { service, remove, events } = await ready();
    remove.mockRejectedValueOnce(cause);
    await expect(service.remove("mine", { force: true })).rejects.toBe(cause);
    expect(service.views).toHaveLength(3);
    expect(service.saving).toBe(false);
    expect(events.failed).toHaveBeenCalledWith({
      id: "test-views",
      stage: "remove",
      cause,
    });
  });
});

describe("revert", () => {
  it("holds, then applies the active view over the edits", async () => {
    const { service, edit, apply, target, events } = await ready();
    edit({ size: 25 });
    await service.revert();
    expect(service.pending).toEqual({ kind: "revert" });
    expect(apply).not.toHaveBeenCalled();

    await service.resolve("proceed");
    expect(target.live).toEqual(all.payload);
    expect(service.drifted).toBe(false);
    expect(service.pending).toBeNull();
    expect(events.reverted).toHaveBeenCalledWith({
      id: "test-views",
      view: service.current,
    });
  });

  it("has nothing to do without drift", async () => {
    const { service, apply } = await ready();
    await service.revert();
    await service.revert({ force: true });
    expect(service.pending).toBeNull();
    expect(apply).not.toHaveBeenCalled();
  });
});

describe("resolve", () => {
  const held = async (from: "all" | "mine" = "mine") => {
    const made = await ready();
    if (from !== "all") await made.service.select(from);
    made.edit({ size: 5 });
    await made.service.select("recent");
    made.apply.mockClear();
    made.events.selected.mockClear();
    return made;
  };

  it("does nothing with nothing pending", async () => {
    const { service, apply } = await ready();
    await service.resolve("proceed");
    expect(apply).not.toHaveBeenCalled();
  });

  it("cancel drops the intent and keeps the edits", async () => {
    const { service, target, apply } = await held();
    await service.resolve("cancel");
    expect(service.pending).toBeNull();
    expect(service.active).toBe("mine");
    expect(target.live.size).toBe(5);
    expect(apply).not.toHaveBeenCalled();
  });

  it("proceed selects and loses the edits", async () => {
    const { service, target, save } = await held();
    await service.resolve("proceed");
    expect(service.active).toBe("recent");
    expect(target.live).toEqual(recent.payload);
    expect(service.pending).toBeNull();
    expect(save).not.toHaveBeenCalled();
    expect(service.views.at(-1)).toEqual(mine);
  });

  it("save stores the edits on the user's view, then selects", async () => {
    const { service, save, target } = await held();
    await service.resolve("save");
    expect(save).toHaveBeenCalledOnce();
    expect(service.views.at(-1)?.payload.size).toBe(5);
    expect(service.active).toBe("recent");
    expect(target.live).toEqual(recent.payload);
    expect(service.pending).toBeNull();
  });

  it("save stores the edits of a system view as a new one", async () => {
    const { service, save, events } = await held("all");
    await service.resolve("save", "Small pages");
    expect(save).toHaveBeenCalledOnce();
    expect(service.views.at(-1)).toMatchObject({
      id: "new",
      name: "Small pages",
      payload: { size: 5 },
    });
    expect(service.views[0]?.payload).toEqual(all.payload);
    expect(service.active).toBe("recent");
    expect(events.selected).toHaveBeenCalledTimes(2);
  });

  it("save on a system view needs the name, and loses nothing", async () => {
    const { service, target } = await held("all");
    await expect(service.resolve("save")).rejects.toThrow("needs a name");
    expect(service.pending).toEqual({ kind: "select", id: "recent" });
    expect(service.active).toBe("all");
    expect(target.live.size).toBe(5);
  });

  it("a failed save leaves the intent pending and the edits in place", async () => {
    const { service, save, target, apply } = await held();
    save.mockRejectedValueOnce(new Error("offline"));
    await expect(service.resolve("save")).rejects.toThrow("offline");
    expect(service.pending).toEqual({ kind: "select", id: "recent" });
    expect(service.active).toBe("mine");
    expect(target.live.size).toBe(5);
    expect(apply).not.toHaveBeenCalled();
  });

  it("proceed carries a removal out", async () => {
    const { service, remove } = await ready();
    await service.remove("mine");
    await service.resolve("proceed");
    expect(remove).toHaveBeenCalledOnce();
    expect(service.views).toHaveLength(2);
    expect(service.pending).toBeNull();
  });

  it("only a selection can save", async () => {
    const { service } = await ready();
    await service.remove("mine");
    await expect(service.resolve("save")).rejects.toThrow("cannot save");
    expect(service.pending).toEqual({ kind: "remove", id: "mine" });
  });
});

describe("container", () => {
  it("emits change for each write, through the middleware", async () => {
    const change = vi.fn();
    const { service, state } = makeService({
      options: { set: { state: { active: (id) => id && id.toUpperCase() } } },
    });
    service.on("change", change);
    await service.init();
    expect(state.active).toBe("ALL");
    expect(change).toHaveBeenCalledWith({
      field: "initialized",
      before: false,
      after: true,
    });
  });

  it("exposes the id and a frozen config", () => {
    const { service } = makeService();
    expect(service.id).toBe("test-views");
    expect(service.config).toEqual(fakeConfig);
    expect(Object.isFrozen(service.config)).toBe(true);
  });
});
