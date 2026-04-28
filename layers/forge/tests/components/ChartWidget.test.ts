import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { passthrough } from "../../../../layers/alloy/app/utils/passthrough";
import { usePassthrough } from "../../../../layers/alloy/app/composables/passthrough";
import { oreStubs, alloyStubs, createStub } from "../../../../packages/testing/helpers/stubs";
import { createMockChart } from "../../../../packages/testing/helpers/mock-chart";
import type { Chart, DataChartVariant } from "../../app/types/data-chart";

const Widget = (await import("../../app/components/Data/Chart/Widget.vue")).default as DefineComponent;

interface TestRow {
  id: number;
  status: string;
  category: string;
}

const now = new Date();
const past = new Date(now.getFullYear(), now.getMonth() - 6, 1);

const fakeVariants: DataChartVariant<TestRow>[] = [
  {
    type: "breakdown",
    fields: ["status", "category"],
    renderers: [{ type: "pie", label: "Pie" }, { type: "bar", label: "Bar" }],
    fetch: vi.fn(async () => ({ labels: ["A", "B"], values: [10, 5] })),
  },
  {
    type: "series",
    fields: ["status", "category"],
    buckets: ["1d", "1w"],
    defaultRange: [past, now],
    renderers: [{ type: "line", label: "Line" }],
    fetch: vi.fn(async () => ({ labels: ["Jan"], datasets: [{ label: "A", data: [1] }] })),
  },
  {
    type: "distribution",
    fields: ["id", "status"],
    defaultRange: [past, now],
    renderers: [{ type: "scatter", label: "Scatter" }],
    fetch: vi.fn(async () => ({ datasets: [{ label: "X", data: [{ x: 1, y: 2 }] }] })),
  },
];

const stubs = {
  ...oreStubs,
  ...alloyStubs,
  DataChartCanvas: createStub("DataChartCanvas"),
};
const mocks = { passthrough, usePassthrough };

const mockChart = (overrides: Partial<Chart<TestRow>> = {}) =>
  ({ ...createMockChart<TestRow>({ topic: "User", variants: fakeVariants }), ...overrides }) as Chart<TestRow>;

const mountWidget = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  shallowMount(Widget, {
    props: { chart: mockChart(), ...props },
    slots,
    global: { stubs, mocks },
  });

describe("DataChartWidget", () => {
  describe("static", () => {
    const wrapper = mountWidget();

    it("renders root with f-data-chart class", () => {
      expect(wrapper.find(".f-data-chart").exists()).toBe(true);
    });

    it("renders toolbar", () => {
      expect(wrapper.find(".f-data-chart-toolbar").exists()).toBe(true);
    });

    it("renders title area", () => {
      expect(wrapper.find(".f-data-chart-title").exists()).toBe(true);
    });

    it("renders actions area", () => {
      expect(wrapper.find(".f-data-chart-actions").exists()).toBe(true);
    });

    it("renders variant popover in title", () => {
      const popovers = wrapper.findAllComponents({ name: "Popover" });
      expect(popovers.length).toBeGreaterThan(0);
    });

    it("renders refresh Fab in actions", () => {
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const refreshFab = fabs.find((f) => f.attributes("icon") === "refresh");
      expect(refreshFab).toBeDefined();
    });

    it("renders renderer popover in actions", () => {
      const popovers = wrapper.findAllComponents({ name: "Popover" });
      // At minimum: variant + field + renderer = 3 for breakdown
      expect(popovers.length).toBeGreaterThanOrEqual(3);
    });

    it("delegates to DataChartCanvas when data exists", () => {
      const chart = mockChart();
      chart.variantData.value = { labels: ["A"], values: [1] };
      const wrapper = shallowMount(Widget, {
        props: { chart },
        global: { stubs, mocks },
      });
      expect(wrapper.findComponent({ name: "DataChartCanvas" }).exists()).toBe(true);
    });
  });

  describe("conditional", () => {
    it("shows loading slot when loading", () => {
      const chart = mockChart();
      chart.loading.value = true;
      const wrapper = shallowMount(Widget, {
        props: { chart },
        slots: { loading: "<span class=\"loading-indicator\">Loading...</span>" },
        global: { stubs, mocks },
      });
      expect(wrapper.find(".loading-indicator").exists()).toBe(true);
    });

    it("shows empty slot when no variant data", () => {
      const chart = mockChart();
      chart.loading.value = false;
      chart.variantData.value = null;
      const wrapper = shallowMount(Widget, {
        props: { chart },
        slots: { empty: "<span class=\"empty-state\">No data</span>" },
        global: { stubs, mocks },
      });
      expect(wrapper.find(".empty-state").exists()).toBe(true);
    });

    it("hides canvas when loading", () => {
      const chart = mockChart();
      chart.loading.value = true;
      chart.variantData.value = { labels: ["A"], values: [1] };
      const wrapper = shallowMount(Widget, {
        props: { chart },
        global: { stubs, mocks },
      });
      expect(wrapper.findComponent({ name: "DataChartCanvas" }).exists()).toBe(false);
    });
  });

  describe("slots", () => {
    it("toolbar slot replaces default toolbar", () => {
      const wrapper = mountWidget({}, {
        toolbar: "<div class=\"custom-toolbar\">Custom</div>",
      });
      expect(wrapper.find(".custom-toolbar").exists()).toBe(true);
      expect(wrapper.find(".f-data-chart-toolbar").exists()).toBe(false);
    });
  });
});
