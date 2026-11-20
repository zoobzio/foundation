// Gold standard: factories. `create*` splits the options once and returns the
// id-scoped composable; the tests assert that composition through the shim's
// Nuxt seams — the shared keyed container and the hook relay — not the
// service's own logic.
import type { TimelineOptions } from "../../../app/types/timeline";
import type { Commit } from "#test/data/timeline";

import { describe, expect, it, vi } from "vitest";
import { useNuxtApp } from "#app";
import { createTimeline } from "../../../app/factories/timeline";
import { NOW, fakeCommits } from "#test/data/timeline";

const makeOptions = (
  overrides: Partial<TimelineOptions<Commit>> = {},
): TimelineOptions<Commit> => ({
  fetch: vi.fn(async ({ cursor }) =>
    cursor === null
      ? { data: fakeCommits.slice(0, 3), cursor: "3" }
      : { data: fakeCommits.slice(3), cursor: null },
  ),
  now: () => NOW,
  key: "sha",
  label: "message",
  limit: 3,
  ...overrides,
});

describe("createTimeline", () => {
  it("returns a composable building a service over the shared store", () => {
    const log = createTimeline("log", makeOptions())();
    expect(log.id).toBe("log");
    expect(log.records).toEqual([]);
    expect(log.limit).toBe(3);
    expect(log.today).toBe("2026-03-04");
  });

  it("splits the config from the actions and the initial slice", () => {
    const log = createTimeline(
      "log",
      makeOptions({
        timeZone: "Europe/Amsterdam",
        group: "month",
        initial: { selected: "e5" },
      }),
    )();
    expect(log.config).toEqual({
      key: "sha",
      label: "message",
      limit: 3,
      timeZone: "Europe/Amsterdam",
      group: "month",
    });
    expect(log.selected).toBe("e5");
  });

  it("fetches through the wired seam, a batch at a time", async () => {
    const options = makeOptions();
    const log = createTimeline("log", options)();
    await log.init();
    expect(options.fetch).toHaveBeenCalledWith(
      { cursor: null, limit: 3, query: "", filters: [] },
      log,
    );
    expect(log.records).toHaveLength(3);
    await log.loadMore();
    expect(options.fetch).toHaveBeenLastCalledWith(
      { cursor: "3", limit: 3, query: "", filters: [] },
      log,
    );
    expect(log.records).toHaveLength(5);
  });

  it("relays service events onto the Nuxt hook bus", async () => {
    const hooks = {
      "timeline:loaded": vi.fn(),
      "timeline:appended": vi.fn(),
      "timeline:selected": vi.fn(),
    };
    useNuxtApp().hooks.addHooks(hooks);
    const log = createTimeline("log", makeOptions())();
    await log.init();
    expect(hooks["timeline:loaded"]).toHaveBeenCalledWith({
      id: "log",
      count: 3,
      more: true,
    });
    await log.loadMore();
    expect(hooks["timeline:appended"]).toHaveBeenCalledWith({
      id: "log",
      count: 5,
      added: 2,
      more: false,
    });
    log.select("e5");
    expect(hooks["timeline:selected"]).toHaveBeenCalledWith({
      id: "log",
      key: "e5",
    });
  });

  it("gives the timeline a sync where the options name a refresh, and logs a poll that fails", async () => {
    expect(createTimeline("log", makeOptions())().sync).toBeUndefined();
    const error = new Error("down");
    const refresh = vi.fn(async () => {
      throw error;
    });
    const log = createTimeline(
      "synced",
      makeOptions({ refresh, sync: { interval: 30_000 } }),
    )();
    expect(log.sync?.interval).toBe(30_000);
    await log.init();
    await log.sync?.poll();
    expect(refresh).toHaveBeenCalledOnce();
    expect(useNuxtApp().$logger("synced").warn).toHaveBeenCalledWith(
      "Timeline sync failed",
      { error },
    );
  });

  it("relays a search and a restore onto the Nuxt hook bus", async () => {
    const hooks = {
      "timeline:filtered": vi.fn(),
      "timeline:restored": vi.fn(),
    };
    useNuxtApp().hooks.addHooks(hooks);
    const log = createTimeline(
      "log",
      makeOptions({ fields: { author: { label: "Author" } } }),
    )();
    await log.init();
    log.query.add({ kind: "filter", key: "author", value: "ada" });
    expect(hooks["timeline:filtered"]).toHaveBeenCalledWith({
      id: "log",
      query: "",
      filters: [{ key: "author", value: "ada" }],
    });
    log.restore({ clauses: [], interval: 0 });
    expect(hooks["timeline:restored"]).toHaveBeenCalledWith({
      id: "log",
      snapshot: { clauses: [], interval: 0 },
    });
  });

  it("lays the contract's text literal under a config that searches and names none", () => {
    const plain = createTimeline("plain", makeOptions())();
    expect(plain.config.literals).toBeUndefined();
    expect(plain.searchable).toBe(false);
    const log = createTimeline(
      "log",
      makeOptions({ fields: { author: { label: "timeline.more" } } }),
    )();
    expect(log.searchable).toBe(true);
    expect(log.query.fields.author?.label).toBe("Load more");
    expect(log.query.literals.text?.label).toBe("Search");
  });

  it("logs each relayed event under the service's id", () => {
    const log = createTimeline("log", makeOptions())();
    log.select("e5");
    expect(useNuxtApp().$logger("log").debug).toHaveBeenCalledWith(
      "Timeline selected",
      { id: "log", key: "e5" },
    );
  });

  it("every call of one composable shares the id's container", async () => {
    const useLog = createTimeline("log", makeOptions());
    const first = useLog();
    await first.init();
    const second = useLog();
    expect(second.records).toBe(first.records);
    expect(second.more).toBe(true);
  });
});
