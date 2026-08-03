// Gold standard: data widgets. The contract mock is the unit seam — table
// state logic has its depth in tests/services/table.test.ts. Sibling feature
// parts (Head/Body/Columns/BulkActions) are stubbed: their behavior belongs to
// their own files. Toolbar and pagination render real because the widget's
// wiring to them (refresh → fetch, page flip → goToPage) is the behavior under
// test here.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { useNuxtApp } from "#imports";
import Widget from "#foundation/components/data/table/widget.vue";
import type {
  TableWidgetEmits,
  TableWidgetProps,
} from "#foundation/types/data/table/widget";
import { createMockTable } from "#test/mocks/table";
import { tableStubs } from "#test/stubs/data";
import type { FakeRow } from "#test/data/table";

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T/K for the harness.
const TableWidget: FunctionalComponent<
  TableWidgetProps<FakeRow, number>,
  TableWidgetEmits
> = Widget;

const mountWidget = (mock = createMockTable()) => {
  const updated: { id: string; total: number }[] = [];
  const wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h(TableWidget, {
            service: mock.service,
            onUpdated: (event: { id: string; total: number }) =>
              updated.push(event),
          });
      },
    }),
    { global: { stubs: tableStubs } },
  );
  return { ...mock, wrapper, updated };
};

describe("data table widget", () => {
  it("kicks off table init through the lazy request", async () => {
    const { service } = mountWidget();
    await flushPromises();
    expect(service.init).toHaveBeenCalledOnce();
  });

  it("renders toolbar and stubbed feature parts inside the frame", () => {
    const { wrapper } = mountWidget();
    expect(wrapper.find(".f-data-table").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Head" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Body" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Columns" }).exists()).toBe(true);
  });

  it("shows bulk actions only while rows are selected", async () => {
    const { state, wrapper } = mountWidget();
    expect(wrapper.findComponent({ name: "BulkActions" }).exists()).toBe(false);
    state.selected.value = new Set([1]);
    await flushPromises();
    expect(wrapper.findComponent({ name: "BulkActions" }).exists()).toBe(true);
  });

  it("refresh control triggers a table fetch", async () => {
    const { service, wrapper } = mountWidget();
    const refresh = wrapper
      .get('use[href="/icons.svg#refresh"]')
      .element.closest("button");
    if (!refresh) throw new Error("refresh fab has no button root");
    refresh.click();
    expect(service.fetch).toHaveBeenCalledOnce();
  });

  it("pagination interaction routes through table.goToPage", async () => {
    const { service, wrapper } = mountWidget();
    const next = wrapper
      .get('use[href="/icons.svg#chevron-right"]')
      .element.closest("button");
    if (!next) throw new Error("next-page fab has no button root");
    next.click();
    expect(service.goToPage).toHaveBeenCalledWith(2);
  });

  it("re-emits table:updated hooks for its own table only", async () => {
    const { updated } = mountWidget();
    const nuxt = useNuxtApp();
    await nuxt.callHook("table:updated", { id: "mock-table", total: 7 });
    await nuxt.callHook("table:updated", { id: "other-table", total: 9 });
    expect(updated).toEqual([{ id: "mock-table", total: 7 }]);
  });
});
