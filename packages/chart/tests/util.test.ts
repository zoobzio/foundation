import { describe, expect, it } from "vitest";
import {
  aggregateBreakdown,
  buildVariants,
  resolveChartDefaults,
} from "../src/util";
import { fakeBreakdown, fakeConfig, fakeRange } from "./data";
import type { FakeRow } from "./data";

describe("buildVariants", () => {
  it("lists declared variants in canonical order with their discriminant", () => {
    const variants = buildVariants<FakeRow>(fakeConfig);
    expect(variants.map((v) => v.type)).toEqual([
      "breakdown",
      "series",
      "distribution",
      "comparison",
    ]);
    expect(variants[0]).toEqual({ type: "breakdown", ...fakeConfig.breakdown });
  });

  it("skips undeclared variants", () => {
    const variants = buildVariants<FakeRow>({
      topic: "contacts",
      comparison: fakeConfig.comparison,
    });
    expect(variants.map((v) => v.type)).toEqual(["comparison"]);
  });

  it("is empty with no variants", () => {
    expect(buildVariants<FakeRow>({ topic: "contacts" })).toEqual([]);
  });
});

describe("resolveChartDefaults", () => {
  it("resolves the selection from the first variant and the bucket from the series", () => {
    expect(resolveChartDefaults(buildVariants<FakeRow>(fakeConfig))).toEqual({
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

  it("takes the range when the first variant declares one", () => {
    const defaults = resolveChartDefaults(
      buildVariants<FakeRow>({
        topic: "contacts",
        distribution: fakeConfig.distribution,
      }),
    );
    expect(defaults.activeRange).toBe(fakeRange);
    expect(defaults.activeBucket).toBeNull();
  });

  it("is empty with no variants", () => {
    expect(resolveChartDefaults<FakeRow>([])).toEqual({
      activeVariant: "",
      activeRenderer: "",
      activeField: null,
      activeGroupBy: null,
      activeX: null,
      activeY: null,
      activeBucket: null,
      activeRange: null,
    });
  });
});

describe("aggregateBreakdown", () => {
  it("returns the data as is without a limit or within it", () => {
    expect(aggregateBreakdown(fakeBreakdown)).toBe(fakeBreakdown);
    expect(aggregateBreakdown(fakeBreakdown, 3)).toBe(fakeBreakdown);
  });

  it("keeps the top slices by value and sums the rest as Other", () => {
    expect(
      aggregateBreakdown(
        { labels: ["c", "a", "b", "d"], values: [1, 5, 3, 2] },
        2,
      ),
    ).toEqual({ labels: ["a", "b", "Other"], values: [5, 3, 3] });
  });

  it("treats a missing value as zero", () => {
    expect(
      aggregateBreakdown({ labels: ["a", "b", "c"], values: [1] }, 1),
    ).toEqual({ labels: ["a", "Other"], values: [1, 0] });
  });
});
