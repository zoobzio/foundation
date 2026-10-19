// A fixture definition drives the panel through the user flow under test:
// definePanel holds inert region configs, a fixture feature composable maps
// each config to a live widget, and usePanel assembles the handle. Filled
// regions render their widget through the erased `<component :is>` path with
// service and resolved settings; regions with neither widget nor slot are
// omitted from the DOM; the region/`widget:` override cascade and the live
// panel's region-keyed services are the behavior under test.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent, PropType } from "vue";
import { mount } from "@vue/test-utils";
import Structure from "../../../../app/components/system/panel.vue";
import { definePanel } from "../../../../app/definitions/panel";
import { usePanel } from "../../../../app/composables/panel";
import type { PanelProps } from "../../../../app/types/system/panel";
import type { AnyWidget } from "../../../../app/types/widget";

type FixtureSettings = { marker?: string };

const FixtureWidget = defineComponent({
  name: "FixtureWidget",
  props: {
    service: {
      type: Object as PropType<{ id: string }>,
      required: true,
    },
    pt: {
      type: Object as PropType<FixtureSettings>,
      required: false,
      default: undefined,
    },
  },
  setup(props) {
    return () =>
      h(
        "div",
        { class: "fixture-widget" },
        `${props.service.id}:${props.pt?.marker ?? "none"}`,
      );
  },
});

// Inert region configs — what the user stores in constants/.
const DEFINITION = definePanel({
  header: { machine: "alpha-machine", marker: "alpha-settings" },
  content: { machine: "beta-machine" },
});

// The fixture feature composable: definition in, live widget out — the
// user's definition→composable mapping at panel scale.
const useFixtureWidget = (definition: {
  machine: string;
  marker?: string;
}): AnyWidget => ({
  service: { id: definition.machine },
  component: FixtureWidget,
  settings: () => ({ marker: definition.marker }),
});

const makeWidgets = () => ({
  header: useFixtureWidget(DEFINITION.header),
  content: useFixtureWidget(DEFINITION.content),
});

type FixtureWidgets = ReturnType<typeof makeWidgets>;

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates R for the harness.
const Panel: FunctionalComponent<PanelProps<FixtureWidgets>> = Structure;

const mountPanel = (slots: Record<string, () => ReturnType<typeof h>> = {}) => {
  return mount(
    defineComponent({
      setup() {
        const panel = usePanel(makeWidgets());
        return () => h(Panel, { panel }, slots);
      },
    }),
  );
};

describe("system panel", () => {
  it("renders each region's widget with service and settings", () => {
    const wrapper = mountPanel();
    const header = wrapper.get(".f-system-panel-header .fixture-widget");
    const content = wrapper.get(".f-system-panel-content .fixture-widget");
    expect(header.text()).toBe("alpha-machine:alpha-settings");
    expect(content.text()).toBe("beta-machine:none");
  });

  it("omits a region with neither widget nor slot", () => {
    const wrapper = mountPanel();
    expect(wrapper.find(".f-system-panel-footer").exists()).toBe(false);
  });

  it("renders an unfilled region when its slot is provided", () => {
    const wrapper = mountPanel({
      footer: () => h("div", { class: "slotted" }, "slot-only"),
    });
    expect(wrapper.get(".f-system-panel-footer .slotted").text()).toBe(
      "slot-only",
    );
  });

  it("region slot overrides the widget wholesale", () => {
    const wrapper = mountPanel({
      header: () => h("div", { class: "override" }, "replaced"),
    });
    expect(wrapper.get(".override").text()).toBe("replaced");
    expect(wrapper.findAll(".fixture-widget").map((w) => w.text())).toEqual([
      "beta-machine:none",
    ]);
  });

  it("widget:<region> overrides the render and receives the service", () => {
    const wrapper = mountPanel({
      "widget:content": () => h("div", { class: "override" }, "replaced"),
    });
    expect(wrapper.get(".override").text()).toBe("replaced");
    expect(wrapper.findAll(".fixture-widget").map((w) => w.text())).toEqual([
      "alpha-machine:alpha-settings",
    ]);
  });
});

describe("usePanel", () => {
  it("exposes services keyed by region", () => {
    const panel = usePanel(makeWidgets());
    expect(panel.services.header.id).toBe("alpha-machine");
    expect(panel.services.content.id).toBe("beta-machine");
  });
});
