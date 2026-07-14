import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, type DefineComponent } from "vue";
import { createMockChart } from "#test/support/helpers/mock-chart";

// Renders the real Group wrapper (Canvas's only child) so the `<canvas>` template
// ref binds — useTemplateRef does not resolve through a stubbed component's slot.
const Canvas = (await import("#foundation/components/data/chart/Canvas.vue")).default as DefineComponent;

const fakeVariants = [{
  type: "breakdown",
  fields: ["status"],
  renderers: [{ type: "pie", label: "Pie" }],
  fetch: vi.fn(async () => ({ labels: [], values: [] })),
}];

const mountCanvas = (props: Record<string, unknown> = {}) => {
  const chart = createMockChart({ topic: "Test", variants: fakeVariants });
  return {
    wrapper: mount(Canvas, {
      props: { chart, ...props },
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
    it("sets chart.canvas ref on mount", async () => {
      const { chart } = mountCanvas();
      await nextTick(); // watchEffect copies the template ref to chart.canvas on flush
      expect(chart.canvas.value).toBeInstanceOf(HTMLCanvasElement);
    });

    it("clears chart.canvas on unmount", async () => {
      const { wrapper, chart } = mountCanvas();
      await nextTick();
      expect(chart.canvas.value).toBeInstanceOf(HTMLCanvasElement);
      wrapper.unmount();
      expect(chart.canvas.value).toBeNull();
    });
  });
});
