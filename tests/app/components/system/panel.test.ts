// A fixture definition drives the panel — assigned regions render their widget
// through the erased `<component :is>` path with service and resolved
// settings; regions with neither widget nor slot are omitted from the DOM;
// the region/`widget:` override cascade is the behavior under test.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent, PropType } from "vue";
import { mount } from "@vue/test-utils";
import Structure from "../../../../app/components/system/panel.vue";
import { definePanel } from "../../../../app/definitions/panel";
import type { PanelProps } from "../../../../app/types/system/panel";
import type { AnyWidget } from "../../../../app/types/widget";

const FixtureWidget = defineComponent({
  name: "FixtureWidget",
  props: {
    service: {
      type: Object as PropType<{ id: string }>,
      required: true,
    },
    pt: { type: Object, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        "div",
        { class: "fixture-widget", "data-pt": JSON.stringify(props.pt ?? null) },
        props.service.id,
      );
  },
});

const makeDefinition = () =>
  definePanel({
    widgets: {
      alpha: (): AnyWidget => ({
        service: { id: "alpha-machine" },
        component: FixtureWidget,
        settings: () => ({ marker: "alpha-settings" }),
      }),
      beta: (): AnyWidget => ({
        service: { id: "beta-machine" },
        component: FixtureWidget,
      }),
    },
    regions: {
      header: "alpha",
      content: "beta",
    },
  });

type Definition = ReturnType<typeof makeDefinition>;

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates R for the harness.
const Panel: FunctionalComponent<PanelProps<Definition["widgets"]>> = Structure;

const mountPanel = (slots: Record<string, () => ReturnType<typeof h>> = {}) => {
  return mount(
    defineComponent({
      setup() {
        return () => h(Panel, { definition: makeDefinition() }, slots);
      },
    }),
  );
};

describe("system panel", () => {
  it("renders assigned widgets in their regions with service and settings", () => {
    const wrapper = mountPanel();
    const header = wrapper.get(".f-system-panel-header .fixture-widget");
    const content = wrapper.get(".f-system-panel-content .fixture-widget");
    expect(header.text()).toBe("alpha-machine");
    expect(header.attributes("data-pt")).toBe(
      JSON.stringify({ marker: "alpha-settings" }),
    );
    expect(content.text()).toBe("beta-machine");
    expect(content.attributes("data-pt")).toBe("null");
  });

  it("omits a region with neither widget nor slot", () => {
    const wrapper = mountPanel();
    expect(wrapper.find(".f-system-panel-footer").exists()).toBe(false);
  });

  it("renders an unassigned region when its slot is provided", () => {
    const wrapper = mountPanel({
      footer: () => h("div", { class: "slotted" }, "slot-only"),
    });
    const footer = wrapper.get(".f-system-panel-footer");
    expect(footer.get(".slotted").text()).toBe("slot-only");
  });

  it("a region slot overrides the region wholesale", () => {
    const wrapper = mountPanel({
      header: () => h("div", { class: "override" }, "custom"),
    });
    expect(wrapper.get(".override").text()).toBe("custom");
    expect(wrapper.findAll(".fixture-widget").map((w) => w.text())).toEqual([
      "beta-machine",
    ]);
  });

  it("widget:<key> overrides the render and receives the service", () => {
    const wrapper = mountPanel({
      "widget:beta": () => h("div", { class: "override" }, "replaced"),
    });
    expect(wrapper.get(".override").text()).toBe("replaced");
    expect(wrapper.findAll(".fixture-widget").map((w) => w.text())).toEqual([
      "alpha-machine",
    ]);
  });
});
