import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { passthrough } from "../../../../layers/alloy/app/utils/passthrough";
import { usePassthrough } from "../../../../layers/alloy/app/composables/passthrough";
import { oreStubs, alloyStubs } from "../../../../packages/testing/helpers/stubs";
import { createMockChart } from "../../../../packages/testing/helpers/mock-chart";

const Canvas = (await import("../../app/components/Data/Chart/Canvas.vue")).default as DefineComponent;
const stubs = { ...oreStubs, ...alloyStubs };
const mocks = { passthrough, usePassthrough };

const fakeVariants = [{
  type: "breakdown",
  fields: ["status"],
  renderers: [{ type: "pie", label: "Pie" }],
  fetch: vi.fn(async () => ({ labels: [], values: [] })),
}];

const mountCanvas = (props: Record<string, unknown> = {}) => {
  const chart = createMockChart({ topic: "Test", variants: fakeVariants });
  return {
    wrapper: shallowMount(Canvas, {
      props: { chart, ...props },
      global: { stubs, mocks },
    }),
    chart,
  };
};

describe("DataChartCanvas", () => {
  describe("static", () => {
    const { wrapper } = mountCanvas();

    it("renders root with f-data-chart-canvas class", () => {
      expect(wrapper.find(".f-data-chart-canvas").exists()).toBe(true);
    });

    it("renders a canvas element", () => {
      expect(wrapper.find("canvas").exists()).toBe(true);
    });
  });

  describe("canvas ref lifecycle", () => {
    it("sets chart.canvas ref on mount", () => {
      const { chart } = mountCanvas();
      expect(chart.canvas.value).toBeInstanceOf(HTMLCanvasElement);
    });

    it("clears chart.canvas on unmount", () => {
      const { wrapper, chart } = mountCanvas();
      expect(chart.canvas.value).toBeInstanceOf(HTMLCanvasElement);
      wrapper.unmount();
      expect(chart.canvas.value).toBeNull();
    });
  });
});
