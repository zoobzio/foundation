// Gold standard: structures. A fixture definition drives the workspace — assigned
// cells render their widget through the erased `<component :is>` path with
// service and resolved settings; unassigned cells stay slot-only; the
// `slot:`/`widget:` override cascade and the grid math are the behavior
// under test.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent, PropType } from "vue";
import { mount } from "@vue/test-utils";
import Structure from "../../../../app/components/system/workspace.vue";
import { defineWorkspace } from "../../../../app/definitions/workspace";
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

const makeDefinition = () =>
  defineWorkspace({
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
    layout: {
      columns: 2,
      rows: 2,
      slots: [
        { id: "main", widget: "alpha", position: [0, 0], span: [1, 2] },
        { id: "side", widget: "beta", position: [1, 0], span: [1, 1] },
        { id: "free", position: [1, 1], span: [1, 1] },
      ],
    },
  });

type Definition = ReturnType<typeof makeDefinition>;

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates R for the harness.
const Workspace: FunctionalComponent<WorkspaceProps<Definition["widgets"]>> =
  Structure;

const mountWorkspace = (
  slots: Record<string, () => ReturnType<typeof h>> = {},
) => {
  return mount(
    defineComponent({
      setup() {
        return () => h(Workspace, { definition: makeDefinition() }, slots);
      },
    }),
  );
};

describe("system workspace", () => {
  it("renders assigned widgets with service and resolved settings", () => {
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

  it("leaves unassigned cells empty but present", () => {
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

  it("widget:<key> overrides the render and receives the service", () => {
    const wrapper = mountWorkspace({
      "widget:beta": () => h("div", { class: "override" }, "replaced"),
    });
    expect(wrapper.get(".override").text()).toBe("replaced");
    expect(
      wrapper.findAll(".fixture-widget").map((w) => w.text()),
    ).toEqual(["alpha-machine"]);
  });
});
