import { describe, expect, it } from "vitest";
import { createChartState } from "../src/state";
import { CHART_STATE_FIELDS } from "../src/constants";
import { fakeConfig, fakeRange } from "./data";
import type { FakeRow } from "./data";

describe("createChartState", () => {
  it("initializes every field from the first declared variant", () => {
    const state = createChartState<FakeRow>(fakeConfig);
    expect(state).toEqual({
      initialized: false,
      loading: false,
      variantData: null,
      activeVariant: "breakdown",
      activeRenderer: "pie",
      activeField: "status",
      activeGroupBy: "name",
      activeX: "status",
      activeY: "name",
      activeBucket: "1d",
      activeRange: null,
    });
  });

  it("takes the range from a first variant that declares one", () => {
    const state = createChartState<FakeRow>({
      topic: "contacts",
      series: fakeConfig.series,
    });
    expect(state.activeVariant).toBe("series");
    expect(state.activeRange).toBe(fakeRange);
    expect(state.activeBucket).toBe("1d");
  });

  it("falls back to empty selection with no variants", () => {
    const state = createChartState<FakeRow>({ topic: "contacts" });
    expect(state.activeVariant).toBe("");
    expect(state.activeRenderer).toBe("");
    expect(state.activeField).toBeNull();
    expect(state.activeBucket).toBeNull();
    expect(state.activeRange).toBeNull();
  });

  it("each call returns an independent container", () => {
    const a = createChartState<FakeRow>(fakeConfig);
    const b = createChartState<FakeRow>(fakeConfig);
    a.activeRenderer = "bar";
    expect(b.activeRenderer).toBe("pie");
  });

  it("CHART_STATE_FIELDS names exactly the container's fields", () => {
    const state = createChartState<FakeRow>(fakeConfig);
    expect(Object.keys(CHART_STATE_FIELDS).sort()).toEqual(
      Object.keys(state).sort(),
    );
  });
});
