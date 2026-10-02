// The chart widget's icon relays: control fabs show their label until
// `controlIcon` fills them, the title trigger takes `controlTitleIcon`, and
// both control regions receive the relays. The service is built through the
// real factory; the canvas is stubbed — chart.js rendering is not under test.
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { defineEntity } from "../../../../../app/definitions/entity";
import { useChart } from "../../../../../app/factories/chart";
import Widget from "../../../../../app/components/data/chart/widget.vue";
import type {
  ChartWidgetEmits,
  ChartWidgetProps,
} from "../../../../../app/types/data/chart/widget";
import type { Actions, BreakdownData } from "../../../../../app/types/data/chart";
import { chartStubs } from "#test/stubs/data";
import type { FakeRow } from "#test/data/table";

// Generic SFCs don't instantiate through h()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
const ChartWidget: FunctionalComponent<
  ChartWidgetProps<FakeRow>,
  ChartWidgetEmits
> = Widget;

const rows = defineEntity<FakeRow>();

const definition = rows.defineChart({
  topic: "contacts",
  breakdown: {
    fields: ["status"],
    renderers: [{ type: "pie" }, { type: "bar" }],
  },
});

const slices: BreakdownData = {
  labels: ["Active", "Inactive"],
  values: [5, 2],
};

const mountWidget = async (slots: Record<string, string> = {}) => {
  const wrapper = mount(
    defineComponent({
      setup(_, { slots: forwarded }) {
        const widget = useChart("c1", definition, {
          breakdown: vi.fn<NonNullable<Actions<FakeRow>["breakdown"]>>(
            async () => slices,
          ),
        });
        return () =>
          h(ChartWidget, { service: widget.service }, forwarded);
      },
    }),
    { slots, global: { stubs: { Canvas: chartStubs.Canvas } } },
  );
  await flushPromises();
  return wrapper;
};

describe("data chart widget", () => {
  it("labels the control fabs and refresh by default", async () => {
    const wrapper = await mountWidget();
    expect(
      wrapper.findAll(".f-data-chart-actions button").map((b) => b.text()),
    ).toEqual(["Field", "Chart type", "Refresh"]);
    expect(
      wrapper.get(".f-data-chart-control-title").element.childElementCount,
    ).toBe(0);
  });

  it("relays control and refresh icon slots into both control regions", async () => {
    const wrapper = await mountWidget({
      controlTitleIcon: `<template #controlTitleIcon="s"><i>{{ s.kind }}</i></template>`,
      controlIcon: `<template #controlIcon="s"><i>{{ s.kind }}</i></template>`,
      refreshIcon: `<template #refreshIcon="s"><b>{{ s.chart.id }}</b></template>`,
    });
    expect(wrapper.get(".f-data-chart-control-title i").text()).toBe(
      "variant",
    );
    expect(
      wrapper.findAll(".f-data-chart-actions i").map((i) => i.text()),
    ).toEqual(["field", "renderer"]);
    expect(wrapper.get('button[aria-label="Refresh"] b').text()).toBe("c1");
  });
});
