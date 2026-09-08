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
import Widget from "../../../../../app/components/data/table/widget.vue";
import type {
  TableWidgetEmits,
  TableWidgetProps,
} from "../../../../../app/types/data/table/widget";
import type { TableHeadSlots } from "../../../../../app/types/data/table/head";
import { createMockTable } from "#test/mocks/table";
import { tableStubs } from "#test/stubs/data";
import type { FakeRow } from "#test/data/table";

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T/K for the harness.
const TableWidget: FunctionalComponent<
  TableWidgetProps<FakeRow>,
  TableWidgetEmits
> = Widget;

type HeaderScope = Parameters<
  NonNullable<TableHeadSlots<FakeRow>["header"]>
>[0];

// Everything but the head stubbed — for the tests that drive the widget's
// header-slot relay through the real head.
const headlessStubs = {
  Body: tableStubs.Body,
  BulkActions: tableStubs.BulkActions,
  Columns: tableStubs.Columns,
} as const;

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
    state.selected.value = new Set(["1"]);
    await flushPromises();
    expect(wrapper.findComponent({ name: "BulkActions" }).exists()).toBe(true);
  });

  it("refresh control triggers a table fetch", async () => {
    const { service, wrapper } = mountWidget();
    const refresh = wrapper
      .get('use[href="#refresh"]')
      .element.closest("button");
    if (!refresh) throw new Error("refresh fab has no button root");
    refresh.click();
    expect(service.fetch).toHaveBeenCalledOnce();
  });

  it("pagination interaction routes through table.goToPage", async () => {
    const { service, wrapper } = mountWidget();
    const next = wrapper
      .get('use[href="#chevron-right"]')
      .element.closest("button");
    if (!next) throw new Error("next-page fab has no button root");
    next.click();
    expect(service.goToPage).toHaveBeenCalledWith(2);
  });

  it("searchable: false hides the toolbar search", () => {
    const { wrapper } = mountWidget(createMockTable({ searchable: false }));
    expect(wrapper.find(".f-data-table-search").exists()).toBe(false);
  });

  it("search submit routes free text through table.setQuery", async () => {
    const { service, wrapper } = mountWidget();
    const input = wrapper.get(".f-data-table-search").get("input");
    await input.setValue("acme");
    await input.trigger("keydown", { key: "Enter" });
    expect(service.setQuery).toHaveBeenCalledWith("acme");
  });

  it("a completed `Label: value` token commits through table.addFilter", async () => {
    const { service, wrapper } = mountWidget();
    const input = wrapper.get(".f-data-table-search").get("input");
    await input.setValue("Status: Active");
    await input.trigger("keydown", { key: "Enter" });
    expect(service.addFilter).toHaveBeenCalledWith("status", "Active");
    expect(service.setQuery).not.toHaveBeenCalled();
  });

  it("an operator token commits with its operator", async () => {
    const { service, wrapper } = mountWidget();
    const input = wrapper.get(".f-data-table-search").get("input");
    await input.setValue("Created: before: 2026-02-01");
    await input.trigger("keydown", { key: "Enter" });
    expect(service.addFilter).toHaveBeenCalledWith(
      "created",
      "2026-02-01",
      "before",
    );
  });

  it("a bare value on an operator column commits with the default operator", async () => {
    const { service, wrapper } = mountWidget();
    const input = wrapper.get(".f-data-table-search").get("input");
    await input.setValue("Created: 2026-03-10");
    await input.trigger("keydown", { key: "Enter" });
    expect(service.addFilter).toHaveBeenCalledWith(
      "created",
      "2026-03-10",
      "on",
    );
  });

  it("committed filters render as chips and click removes them", async () => {
    const { service, state, wrapper } = mountWidget();
    state.filters.value = [{ key: "status", value: "Active" }];
    await flushPromises();
    const chip = wrapper.get(".f-data-table-search .f-chip");
    expect(chip.text()).toContain("Status: Active");
    await chip.trigger("click");
    expect(service.removeFilter).toHaveBeenCalledWith(0);
  });

  it("backspace on empty input unwraps the last chip into editable text", async () => {
    const { service, state, wrapper } = mountWidget();
    state.filters.value = [{ key: "status", value: "quoted" }];
    await flushPromises();
    const input = wrapper.get(".f-data-table-search").get("input");
    await input.trigger("keydown", { key: "Backspace" });
    await flushPromises();
    expect(service.removeFilter).toHaveBeenCalledWith(0);
    expect(input.element.value).toBe("Status: quote");
  });

  it("unwrapping an operator filter restores the full token form", async () => {
    const { service, state, wrapper } = mountWidget();
    state.filters.value = [
      { key: "created", op: "before", value: "2026-02-01" },
    ];
    await flushPromises();
    const input = wrapper.get(".f-data-table-search").get("input");
    await input.trigger("keydown", { key: "Backspace" });
    await flushPromises();
    expect(service.removeFilter).toHaveBeenCalledWith(0);
    expect(input.element.value).toBe("Created: before: 2026-02-0");
  });

  it("unwrapping the query chip restores the query text", async () => {
    const { service, state, wrapper } = mountWidget();
    state.query.value = "acme";
    await flushPromises();
    const input = wrapper.get(".f-data-table-search").get("input");
    await input.trigger("keydown", { key: "Backspace" });
    await flushPromises();
    expect(service.setQuery).toHaveBeenCalledWith("");
    expect(input.element.value).toBe("acm");
  });

  it("re-emits table:updated hooks for its own table only", async () => {
    const { updated } = mountWidget();
    const nuxt = useNuxtApp();
    await nuxt.callHook("table:updated", { id: "mock-table", total: 7 });
    await nuxt.callHook("table:updated", { id: "other-table", total: 9 });
    expect(updated).toEqual([{ id: "mock-table", total: 7 }]);
  });

  // The head renders real here: the forward-only-when-supplied contract is
  // invisible against a stub that swallows slot content.
  it("keeps the head's default headers when no header slot is supplied", () => {
    const mock = createMockTable();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(TableWidget, { service: mock.service });
        },
      }),
      { global: { stubs: headlessStubs } },
    );
    const sortable = wrapper.findAll(".f-data-table-header-btn");
    expect(sortable.map((b) => b.text())).toEqual(["Name", "Created"]);
  });

  it("a supplied header slot overrides the head's default", () => {
    const mock = createMockTable();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              TableWidget,
              { service: mock.service },
              {
                header: (scope: HeaderScope) =>
                  h("output", String(scope.column.key)),
              },
            );
        },
      }),
      { global: { stubs: headlessStubs } },
    );
    expect(wrapper.findAll("output").map((o) => o.text())).toEqual(
      mock.service.visibleColumns.map((c) => String(c.key)),
    );
    expect(wrapper.find(".f-data-table-header-btn").exists()).toBe(false);
  });
});
