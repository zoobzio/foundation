// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, config-driven
// defaults, and the one-time seed, not the proxy plumbing.
import type { TableView } from "../../../app/types/views";
import type { Config } from "@zoobzio/views";

import { describe, expect, it } from "vitest";
import { TABLE_VIEW_SCHEMA } from "../../../app/constants/views";
import { accessViews } from "../../../app/stores/views";

const all = TABLE_VIEW_SCHEMA.parse({});

const config: Config<TableView> = {
  schema: TABLE_VIEW_SCHEMA,
  views: [
    { id: "all", name: "All", payload: all },
    { id: "big", name: "Big", payload: { ...all, pageSize: 50 } },
  ],
};

describe("accessViews", () => {
  it("initializes the container from the config's views", () => {
    const state = accessViews("v1", config);
    expect(state.views.map((view) => view.id)).toEqual(["all", "big"]);
    expect(state.active).toBe("all");
    expect(state.initialized).toBe(false);
    expect(state.pending).toBeNull();
  });

  it("starts on the config's initial view", () => {
    expect(accessViews("v1", { ...config, initial: "big" }).active).toBe("big");
  });

  it("shares one container per id, shaped once", () => {
    const first = accessViews("v1", config);
    first.active = "big";
    expect(accessViews("v1", { ...config, views: [] })).toBe(first);
    expect(accessViews("v2", config)).not.toBe(first);
  });
});
