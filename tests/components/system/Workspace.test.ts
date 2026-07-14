import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { ref, computed } from "vue";
import { commonStubs, coreStubs, dataStubs } from "#test/stubs";
import type { Workspace, WorkspaceLayout } from "#foundation/types/system/workspace";
import type { PageSlot } from "#foundation/types/system/page";

// Generic SFC needs DefineComponent cast for Vue Test Utils
const WorkspaceComponent = (await import("#foundation/components/system/Workspace.vue")).default as DefineComponent;

const stubs = { ...commonStubs, ...coreStubs, ...dataStubs };

const makeLayout = (): WorkspaceLayout => ({
  columns: 3,
  rows: 2,
  slots: [
    { id: "main", position: [0, 0], span: [2, 2] },
    { id: "side", position: [2, 0], span: [1, 1] },
  ],
});

const mockWorkspace = (overrides: Partial<Workspace> = {}): Workspace => {
  const layout = ref(makeLayout());
  return {
    initialized: ref(true),
    loading: ref(false),
    layout,
    gridStyle: computed(() => ({
      display: "grid",
      "grid-template-columns": `repeat(${layout.value.columns}, 1fr)`,
      "grid-template-rows": `repeat(${layout.value.rows}, 1fr)`,
    })),
    slotStyle: (slot: PageSlot) => ({
      "grid-column": `${slot.position[0] + 1} / span ${slot.span[0]}`,
      "grid-row": `${slot.position[1] + 1} / span ${slot.span[1]}`,
    }),
    init: async () => true,
    ...overrides,
  };
};

const factory = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  shallowMount(WorkspaceComponent, {
    props: { workspace: mockWorkspace(), ...props },
    slots,
    global: { stubs },
  });

describe("Workspace", () => {
  it("renders root with f-workspace class", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-workspace").exists()).toBe(true);
  });

  it("renders grid with f-workspace-grid class", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-workspace-grid").exists()).toBe(true);
  });

  it("renders default header when no header slot provided", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-workspace-header").exists()).toBe(true);
  });

  it("renders default footer when no footer slot provided", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-workspace-footer").exists()).toBe(true);
  });

  it("renders a slot container for each layout slot", () => {
    const wrapper = factory();
    const slotDivs = wrapper.findAll(".f-workspace-slot");
    expect(slotDivs).toHaveLength(2);
  });

  it("applies gridStyle to the grid element", () => {
    const wrapper = factory();
    const grid = wrapper.find(".f-workspace-grid");
    expect(grid.attributes("style")).toContain("grid-template-columns: repeat(3, 1fr)");
    expect(grid.attributes("style")).toContain("grid-template-rows: repeat(2, 1fr)");
  });

  it("applies slotStyle to each slot container", () => {
    const wrapper = factory();
    const slotDivs = wrapper.findAll(".f-workspace-slot");
    // Main slot: position [0,0], span [2,2]
    expect(slotDivs[0].attributes("style")).toContain("grid-column: 1 / span 2");
    expect(slotDivs[0].attributes("style")).toContain("grid-row: 1 / span 2");
    // Side slot: position [2,0], span [1,1]
    expect(slotDivs[1].attributes("style")).toContain("grid-column: 3 / span 1");
    expect(slotDivs[1].attributes("style")).toContain("grid-row: 1 / span 1");
  });

  it("renders custom header slot content", () => {
    const wrapper = factory({}, { header: "<div class='custom-header'>Custom</div>" });
    expect(wrapper.find(".custom-header").exists()).toBe(true);
    expect(wrapper.find(".f-workspace-header").exists()).toBe(false);
  });

  it("renders custom footer slot content", () => {
    const wrapper = factory({}, { footer: "<div class='custom-footer'>Custom</div>" });
    expect(wrapper.find(".custom-footer").exists()).toBe(true);
    expect(wrapper.find(".f-workspace-footer").exists()).toBe(false);
  });

  it("renders named slot content into the correct layout slot", () => {
    const wrapper = factory({}, { main: "<div class='main-content'>Main</div>" });
    const mainSlot = wrapper.findAll(".f-workspace-slot")[0];
    expect(mainSlot.find(".main-content").exists()).toBe(true);
  });
});
