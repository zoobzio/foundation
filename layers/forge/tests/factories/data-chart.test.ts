import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import { createChart } from "../../app/factories/data-chart";
import type {
  DataChartConfig,
  BreakdownData,
  SeriesData,
  DistributionData,
} from "../../app/types/data-chart";

interface TestRow {
  id: number;
  status: string;
  category: string;
  created: string;
}

const fakeBreakdown: BreakdownData = {
  labels: ["Active", "Inactive"],
  values: [10, 5],
};

const fakeSeries: SeriesData = {
  labels: ["Jan", "Feb", "Mar"],
  datasets: [{ label: "Active", data: [3, 2, 4] }],
};

const fakeDistribution: DistributionData = {
  datasets: [{ label: "Users", data: [{ x: 1, y: 2 }, { x: 3, y: 4 }] }],
};

const breakdownFetch = vi.fn(async () => fakeBreakdown);
const seriesFetch = vi.fn(async () => fakeSeries);
const distributionFetch = vi.fn(async () => fakeDistribution);

const now = new Date();
const past = new Date(now.getFullYear(), now.getMonth() - 6, 1);

const config: DataChartConfig<TestRow> = {
  topic: "User",
  breakdown: {
    fields: ["status", "category"],
    renderers: [{ type: "pie" }, { type: "bar", label: "Bar" }],
    fetch: breakdownFetch,
  },
  series: {
    fields: ["status", "category"],
    buckets: ["1d", "1w", "1mo"],
    defaultRange: [past, now],
    renderers: [{ type: "line" }, { type: "bar" }],
    fetch: seriesFetch,
  },
  distribution: {
    fields: ["id", "status", "category"],
    defaultRange: [past, now],
    renderers: [{ type: "scatter" }],
    fetch: distributionFetch,
  },
  params: () => ({
    query: "",
    keywords: "",
    match: "all" as const,
    facets: new Set<string>(),
    dateFilters: [],
  }),
};

const makeChart = (id = "test") => createChart<TestRow>(id, config)();

describe("createChart", () => {
  beforeEach(() => {
    breakdownFetch.mockClear();
    seriesFetch.mockClear();
    distributionFetch.mockClear();
  });

  describe("defaults", () => {
    it("initializes with first variant and renderer", () => {
      const chart = makeChart();
      expect(chart.activeVariant.value).toBe("breakdown");
      expect(chart.activeRenderer.value).toBe("pie");
    });

    it("initializes activeField to first field", () => {
      const chart = makeChart("field-test");
      expect(chart.activeField.value).toBe("status");
    });

    it("initializes with correct topic", () => {
      const chart = makeChart("topic-test");
      expect(chart.topic).toBe("User");
    });

    it("computes title from topic + variant", () => {
      const chart = makeChart("title-test");
      expect(chart.title.value).toBe("User Breakdown");
    });

    it("initializes canvas as null", () => {
      const chart = makeChart("canvas-test");
      expect(chart.canvas.value).toBeNull();
    });
  });

  describe("state", () => {
    it("activeVariantConfig resolves the active variant", () => {
      const chart = makeChart("config-test");
      expect(chart.activeVariantConfig.value.type).toBe("breakdown");
    });

    it("activeVariantConfig falls back to first for invalid type", () => {
      const chart = makeChart("fallback-test");
      chart.activeVariant.value = "nonexistent";
      expect(chart.activeVariantConfig.value.type).toBe("breakdown");
    });

    it("title updates when variant changes", () => {
      const chart = makeChart("title-change-test");
      chart.activeVariant.value = "series";
      expect(chart.title.value).toBe("User Series");
    });
  });

  describe("actions", () => {
    it("setVariant updates variant, resets state, and fetches", async () => {
      const chart = makeChart("setvariant-test");
      chart.setVariant("series");
      await nextTick();
      expect(chart.activeVariant.value).toBe("series");
      expect(chart.activeRenderer.value).toBe("line");
      expect(chart.activeField.value).toBe("status");
      expect(chart.activeBucket.value).toBe("1d");
      expect(chart.activeRange.value).toEqual([past, now]);
      expect(seriesFetch).toHaveBeenCalledOnce();
    });

    it("setVariant to breakdown clears bucket and range", async () => {
      const chart = makeChart("setvariant-breakdown-test");
      chart.setVariant("series");
      await nextTick();
      chart.setVariant("breakdown");
      await nextTick();
      expect(chart.activeBucket.value).toBeNull();
      expect(chart.activeRange.value).toBeNull();
    });

    it("setVariant ignores invalid types", () => {
      const chart = makeChart("setvariant-invalid-test");
      chart.setVariant("nonexistent");
      expect(chart.activeVariant.value).toBe("breakdown");
    });

    it("setRenderer updates renderer within current variant", () => {
      const chart = makeChart("setrenderer-test");
      chart.setRenderer("bar");
      expect(chart.activeRenderer.value).toBe("bar");
    });

    it("setRenderer ignores types not in current variant", () => {
      const chart = makeChart("setrenderer-invalid-test");
      chart.setRenderer("scatter");
      expect(chart.activeRenderer.value).toBe("pie");
    });

    it("setField updates field and fetches", async () => {
      const chart = makeChart("setfield-test");
      chart.setField("category");
      await nextTick();
      expect(chart.activeField.value).toBe("category");
      expect(breakdownFetch).toHaveBeenCalled();
    });

    it("setX and setY update distribution fields and fetch", async () => {
      const chart = makeChart("setxy-test");
      chart.setVariant("distribution");
      await nextTick();
      distributionFetch.mockClear();
      chart.setX("category");
      await nextTick();
      expect(chart.activeX.value).toBe("category");
      expect(distributionFetch).toHaveBeenCalled();
    });

    it("setBucket updates bucket and fetches", async () => {
      const chart = makeChart("setbucket-test");
      chart.setVariant("series");
      await nextTick();
      seriesFetch.mockClear();
      chart.setBucket("1w");
      await nextTick();
      expect(chart.activeBucket.value).toBe("1w");
      expect(seriesFetch).toHaveBeenCalled();
    });

    it("setRange updates range and fetches", async () => {
      const chart = makeChart("setrange-test");
      chart.setVariant("series");
      await nextTick();
      seriesFetch.mockClear();
      const newRange: [Date, Date] = [new Date("2025-01-01"), new Date("2025-06-01")];
      chart.setRange(newRange);
      await nextTick();
      expect(chart.activeRange.value).toEqual(newRange);
      expect(seriesFetch).toHaveBeenCalled();
    });

    it("init calls fetch and sets initialized", async () => {
      const chart = makeChart("init-test");
      expect(chart.initialized.value).toBe(false);
      await chart.init();
      expect(chart.initialized.value).toBe(true);
      expect(breakdownFetch).toHaveBeenCalledOnce();
    });

    it("init is idempotent", async () => {
      const chart = makeChart("init-idempotent-test");
      await chart.init();
      await chart.init();
      expect(breakdownFetch).toHaveBeenCalledOnce();
    });

    it("fetch passes correct params for breakdown", async () => {
      const chart = makeChart("fetch-breakdown-test");
      chart.activeField.value = "category";
      await chart.fetch();
      expect(breakdownFetch).toHaveBeenCalledWith(
        expect.objectContaining({ field: "category" }),
      );
    });

    it("fetch passes correct params for series", async () => {
      const chart = makeChart("fetch-series-test");
      chart.setVariant("series");
      await nextTick();
      seriesFetch.mockClear();
      chart.activeField.value = "category";
      chart.activeBucket.value = "1w";
      await chart.fetch();
      expect(seriesFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          field: "category",
          bucket: "1w",
          range: [past, now],
        }),
      );
    });

    it("fetch passes correct params for distribution", async () => {
      const chart = makeChart("fetch-dist-test");
      chart.setVariant("distribution");
      await nextTick();
      distributionFetch.mockClear();
      chart.activeX.value = "id";
      chart.activeY.value = "status";
      await chart.fetch();
      expect(distributionFetch).toHaveBeenCalledWith(
        expect.objectContaining({ x: "id", y: "status" }),
      );
    });

    it("fetch sets loading during execution", async () => {
      let resolvePromise: () => void;
      const slowFetch = vi.fn(
        () => new Promise<BreakdownData>((resolve) => {
          resolvePromise = () => resolve(fakeBreakdown);
        }),
      );
      const slowConfig: DataChartConfig<TestRow> = {
        ...config,
        breakdown: { ...config.breakdown!, fetch: slowFetch },
      };
      const chart = createChart<TestRow>("loading-test", slowConfig)();
      const promise = chart.fetch();
      expect(chart.loading.value).toBe(true);
      resolvePromise!();
      await promise;
      expect(chart.loading.value).toBe(false);
    });
  });

  describe("persistence", () => {
    it("getSnapshot captures current state", () => {
      const chart = makeChart("snapshot-get-test");
      chart.activeField.value = "category";
      const snap = chart.getSnapshot();
      expect(snap.activeVariant).toBe("breakdown");
      expect(snap.activeField).toBe("category");
    });

    it("restoreSnapshot applies state and fetches", async () => {
      const chart = makeChart("snapshot-restore-test");
      chart.restoreSnapshot({
        activeVariant: "series",
        activeRenderer: "bar",
        activeField: "category",
        activeX: null,
        activeY: null,
        activeBucket: "1w",
        activeRange: [past, now],
      });
      await nextTick();
      expect(chart.activeVariant.value).toBe("series");
      expect(chart.activeRenderer.value).toBe("bar");
      expect(chart.activeField.value).toBe("category");
      expect(chart.activeBucket.value).toBe("1w");
      expect(seriesFetch).toHaveBeenCalled();
    });

    it("round-trips through snapshot", async () => {
      const chart = makeChart("snapshot-roundtrip-test");
      chart.setVariant("series");
      await nextTick();
      chart.setRenderer("bar");
      chart.setBucket("1w");
      await nextTick();
      const snap = chart.getSnapshot();

      chart.setVariant("breakdown");
      await nextTick();
      chart.restoreSnapshot(snap);
      await nextTick();

      expect(chart.activeVariant.value).toBe("series");
      expect(chart.activeRenderer.value).toBe("bar");
      expect(chart.activeBucket.value).toBe("1w");
    });
  });
});
