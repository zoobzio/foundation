import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { createWorkspace } from "../../app/factories/workspace";
import type { WorkspaceFactoryConfig } from "../../app/types/workspace";

const config: WorkspaceFactoryConfig = {
  layout: {
    columns: 3,
    rows: 2,
    slots: [
      { id: "main", position: [0, 0], span: [2, 2] },
      { id: "side", position: [2, 0], span: [1, 1] },
    ],
  },
};

const makeWorkspace = (id = "test") => createWorkspace(id, config)();

describe("createWorkspace", () => {
  it("returns a workspace with default state", () => {
    const ws = makeWorkspace("default");
    expect(ws.initialized.value).toBe(false);
    expect(ws.loading.value).toBe(false);
  });

  it("layout reflects the factory config", () => {
    const ws = makeWorkspace("layout");
    expect(ws.layout.value.columns).toBe(3);
    expect(ws.layout.value.rows).toBe(2);
    expect(ws.layout.value.slots).toHaveLength(2);
  });

  it("gridStyle computes CSS grid properties from layout", () => {
    const ws = makeWorkspace("grid-style");
    expect(ws.gridStyle.value).toEqual({
      display: "grid",
      "grid-template-columns": "repeat(3, 1fr)",
      "grid-template-rows": "repeat(2, 1fr)",
    });
  });

  it("gridStyle updates when layout changes", async () => {
    const ws = makeWorkspace("grid-reactive");
    ws.layout.value = { columns: 4, rows: 3, slots: [] };
    await nextTick();
    expect(ws.gridStyle.value["grid-template-columns"]).toBe("repeat(4, 1fr)");
    expect(ws.gridStyle.value["grid-template-rows"]).toBe("repeat(3, 1fr)");
  });

  it("slotStyle returns correct grid placement", () => {
    const ws = makeWorkspace("slot-style");
    const slot = ws.layout.value.slots[0];
    const style = ws.slotStyle(slot);
    expect(style["grid-column"]).toBe("1 / span 2");
    expect(style["grid-row"]).toBe("1 / span 2");
  });

  it("slotStyle handles non-zero positions", () => {
    const ws = makeWorkspace("slot-offset");
    const slot = ws.layout.value.slots[1];
    const style = ws.slotStyle(slot);
    expect(style["grid-column"]).toBe("3 / span 1");
    expect(style["grid-row"]).toBe("1 / span 1");
  });

  it("init sets initialized and loading flags", async () => {
    const ws = makeWorkspace("init");
    const result = await ws.init();
    expect(result).toBe(true);
    expect(ws.initialized.value).toBe(true);
    expect(ws.loading.value).toBe(false);
  });

  it("init is idempotent — calling twice returns true without re-running", async () => {
    const ws = makeWorkspace("init-idempotent");
    await ws.init();
    const result = await ws.init();
    expect(result).toBe(true);
    expect(ws.initialized.value).toBe(true);
  });
});
