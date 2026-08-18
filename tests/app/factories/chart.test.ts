// Gold standard: widget composables. The composable composes store + service
// through the shim's Nuxt seams — tests assert the composition: live reactive
// views over shared keyed state, not re-tested service logic.
import { describe, expect, it, vi } from "vitest";
import { toValue } from "vue";
import { defineEntity } from "../../../app/definitions/entity";
import { useChart } from "../../../app/factories/chart";
import type { Actions, BreakdownData } from "../../../app/types/data/chart";
import type { FakeRow } from "#test/data/table";

const rows = defineEntity<FakeRow>();

const definition = rows.defineChart({
  topic: "contacts",
  breakdown: {
    fields: ["status"],
    renderers: [{ type: "pie" }, { type: "bar" }],
  },
});

const slices: BreakdownData = {
  labels: ["Active", "Inactive", "Pending"],
  values: [5, 2, 1],
};

const makeWiring = () => ({
  breakdown: vi.fn<NonNullable<Actions<FakeRow>["breakdown"]>>(
    async () => slices,
  ),
});

describe("useChart", () => {
  it("yields the widget triple resolving pt into settings", () => {
    const widget = useChart(
      "c1",
      { ...definition, pt: { root: { label: "chart" } } },
      makeWiring(),
    );
    expect(widget.component).toBeDefined();
    expect(toValue(widget.settings)).toEqual({ root: { label: "chart" } });
  });

  it("merges wiring pt over the definition base per key", () => {
    const widget = useChart(
      "c1",
      {
        ...definition,
        pt: { root: { label: "base" }, title: { label: "kept" } },
      },
      { ...makeWiring(), pt: { root: { label: "override" } } },
    );
    expect(toValue(widget.settings)).toEqual({
      root: { label: "override" },
      title: { label: "kept" },
    });
  });

  it("builds a chart over fresh store state", () => {
    const chart = useChart("c1", definition, makeWiring()).service;
    expect(chart.id).toBe("c1");
    expect(chart.initialized).toBe(false);
    expect(chart.variantData).toBeNull();
    expect(chart.activeVariant).toBe("breakdown");
    expect(chart.activeRenderer).toBe("pie");
    expect(chart.activeField).toBe("status");
  });

  it("init dispatches the active variant's fetcher into the views", async () => {
    const wiring = makeWiring();
    const chart = useChart("c1", definition, wiring).service;
    await chart.init();
    expect(wiring.breakdown).toHaveBeenCalledOnce();
    expect(wiring.breakdown.mock.calls.at(0)?.[0]).toMatchObject({
      field: "status",
    });
    expect(chart.variantData).toEqual(slices);
    expect(chart.initialized).toBe(true);
  });

  it("same id shares state across instances", async () => {
    const a = useChart("c1", definition, makeWiring()).service;
    const b = useChart("c1", definition, makeWiring()).service;
    await a.init();
    a.setRenderer("bar");
    expect(b.activeRenderer).toBe("bar");
    expect(b.variantData).toEqual(slices);
  });

  it("different ids stay independent", async () => {
    const a = useChart("c1", definition, makeWiring()).service;
    const b = useChart("c2", definition, makeWiring()).service;
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.variantData).toBeNull();
  });
});
