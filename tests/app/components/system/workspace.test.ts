// Gold standard: structures. A fixture definition drives the workspace
// through the user flow under test: defineWorkspace holds grid geometry and
// per-slot widget configs, a fixture feature composable maps each config to
// a live widget, and useWorkspace assembles the handle. Filled cells render
// their widget through the erased `<component :is>` path with service and
// resolved settings; widgetless cells stay slot-only; the `slot:`/`widget:`
// override cascade, the grid math, and the live workspace's id-keyed
// services are the behavior under test.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent, PropType } from "vue";
import { mount } from "@vue/test-utils";
import Structure from "../../../../app/components/system/workspace.vue";
import { defineWorkspace } from "../../../../app/definitions/workspace";
import { useWorkspace } from "../../../../app/composables/workspace";
import type { WorkspaceProps } from "../../../../app/types/system/workspace";
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

// Inert configuration — what the user stores in constants/.
const DEFINITION = defineWorkspace({
  columns: 2,
  rows: 2,
  slots: {
    main: {
      position: [0, 0],
      span: [1, 2],
      widget: { machine: "alpha-machine", marker: "alpha-settings" },
    },
    side: {
      position: [1, 0],
      span: [1, 1],
      widget: { machine: "beta-machine" },
    },
    free: { position: [1, 1], span: [1, 1] },
  },
});

// The fixture feature composable: definition in, live widget out — the
// user's definition→composable mapping at workspace scale.
const useFixtureWidget = (definition: {
  machine: string;
  marker?: string;
}): AnyWidget => ({
  service: { id: definition.machine },
  component: FixtureWidget,
  settings:
    definition.marker === undefined
      ? undefined
      : () => ({ marker: definition.marker }),
});

const makeWidgets = () => ({
  main: useFixtureWidget(DEFINITION.slots.main.widget),
  side: useFixtureWidget(DEFINITION.slots.side.widget),
});

type FixtureWidgets = ReturnType<typeof makeWidgets>;

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates R for the harness.
const Workspace: FunctionalComponent<WorkspaceProps<FixtureWidgets>> =
  Structure;

const mountWorkspace = (
  slots: Record<string, () => ReturnType<typeof h>> = {},
) => {
  return mount(
    defineComponent({
      setup() {
        const workspace = useWorkspace(DEFINITION, makeWidgets());
        return () => h(Workspace, { workspace }, slots);
      },
    }),
  );
};

describe("system workspace", () => {
  it("renders each slot's widget with service and resolved settings", () => {
    const wrapper = mountWorkspace();
    const rendered = wrapper.findAll(".fixture-widget");
    expect(rendered.map((w) => w.text())).toEqual([
      "alpha-machine",
      "beta-machine",
    ]);
    expect(rendered[0]?.attributes("data-pt")).toBe(
      JSON.stringify({ marker: "alpha-settings" }),
    );
    expect(rendered[1]?.attributes("data-pt")).toBe("null");
  });

  it("leaves widgetless cells empty but present", () => {
    const wrapper = mountWorkspace();
    const cells = wrapper.findAll(".f-system-workspace-slot");
    expect(cells).toHaveLength(3);
    expect(cells[2]?.text()).toBe("");
  });

  it("lays out the grid from the definition", () => {
    const wrapper = mountWorkspace();
    const grid = wrapper.get(".f-system-workspace-grid");
    expect(grid.attributes("style")).toContain(
      "grid-template-columns: repeat(2, 1fr)",
    );
    const cells = wrapper.findAll(".f-system-workspace-slot");
    expect(cells[0]?.attributes("style")).toContain("grid-column: 1 / span 1");
    expect(cells[0]?.attributes("style")).toContain("grid-row: 1 / span 2");
  });

  it("slot:<id> overrides a cell wholesale", () => {
    const wrapper = mountWorkspace({
      "slot:main": () => h("div", { class: "override" }, "custom"),
    });
    expect(wrapper.get(".override").text()).toBe("custom");
    expect(
      wrapper.findAll(".fixture-widget").map((w) => w.text()),
    ).toEqual(["beta-machine"]);
  });

  it("widget:<id> overrides the render and receives the service", () => {
    const wrapper = mountWorkspace({
      "widget:side": () => h("div", { class: "override" }, "replaced"),
    });
    expect(wrapper.get(".override").text()).toBe("replaced");
    expect(
      wrapper.findAll(".fixture-widget").map((w) => w.text()),
    ).toEqual(["alpha-machine"]);
  });
});

describe("useWorkspace", () => {
  it("exposes services keyed by slot id and the layout on the handle", () => {
    const workspace = useWorkspace(DEFINITION, makeWidgets());
    expect(workspace.services.main.id).toBe("alpha-machine");
    expect(workspace.services.side.id).toBe("beta-machine");
    expect(workspace.layout).toBe(DEFINITION);
  });
});
