import { describe, it, expect } from "vitest";
import { ref, shallowRef } from "vue";
import { useFilterUnravel } from "../../app/composables/unravel";
import { createMockTable } from "../../../../packages/testing/helpers/mock-table";
import { fakeColumns } from "../../../../packages/testing/data/table";
import type { FakeRow } from "../../../../packages/testing/data/table";
import type { DataTableColumn } from "../../app/types/data-table";

const makeState = () => ({
  inputValue: ref(""),
  lockedField: shallowRef<DataTableColumn<FakeRow> | null>(null),
  lockedOperator: ref<string | null>(null),
  lockedDate1: ref<string | null>(null),
  lockedSteps: ref<{ label: string; value: string; icon?: string; hasChildren?: boolean }[]>([]),
});

describe("useFilterUnravel", () => {
  it("unravels an enum filter into autocomplete state", () => {
    const table = createMockTable<FakeRow, number>({ columns: fakeColumns, rowKey: "id" });
    // Simulate a status:Active filter
    table.selectedFacets.value = new Set(["status:Active"]);
    (table as Record<string, unknown>).filters = {
      value: [{
        field: "status",
        operator: "is",
        value: { type: "enum", value: ["Active"] },
      }],
    };

    const state = makeState();
    const { tryUnravel } = useFilterUnravel(table, state);
    const result = tryUnravel();

    expect(result).toBe(true);
    expect(state.inputValue.value).toBe("Status=Activ");
    expect(state.lockedField.value?.key).toBe("status");
    expect(state.lockedSteps.value).toHaveLength(1);
    // Enum unravel removes from selectedFacets, not via removeFilter
    expect(table.selectedFacets.value.has("status:Active")).toBe(false);
    expect(table.removeFilter).not.toHaveBeenCalled();
  });

  it("unravels a date filter and calls removeFilter", () => {
    const table = createMockTable<FakeRow, number>({ columns: fakeColumns, rowKey: "id" });
    (table as Record<string, unknown>).filters = {
      value: [{
        field: "created",
        operator: "after",
        value: { type: "date", value: new Date("2025-06-15T00:00:00Z") },
      }],
    };

    const state = makeState();
    const { tryUnravel } = useFilterUnravel(table, state);
    tryUnravel();

    expect(state.lockedField.value?.key).toBe("created");
    expect(state.lockedOperator.value).toBe(">");
    expect(table.removeFilter).toHaveBeenCalledWith(0);
  });

  it("unravels a query filter", () => {
    const table = createMockTable<FakeRow, number>({ columns: fakeColumns, rowKey: "id" });
    (table as Record<string, unknown>).filters = {
      value: [{
        field: "__query",
        operator: "semantic",
        value: { type: "text", value: "hello world" },
      }],
    };

    const state = makeState();
    const { tryUnravel } = useFilterUnravel(table, state);
    tryUnravel();

    expect(state.inputValue.value).toBe('"hello world');
    expect(state.lockedField.value).toBeNull();
    expect(table.removeFilter).toHaveBeenCalledWith(0);
  });

  it("falls back to removeFilter for unknown filter types", () => {
    const table = createMockTable<FakeRow, number>({ columns: fakeColumns, rowKey: "id" });
    (table as Record<string, unknown>).filters = {
      value: [{
        field: "unknown",
        operator: "eq",
        value: { type: "number", value: 42 },
      }],
    };

    const state = makeState();
    const { tryUnravel } = useFilterUnravel(table, state);
    tryUnravel();

    expect(state.inputValue.value).toBe("");
    expect(table.removeFilter).toHaveBeenCalledWith(0);
  });

  it("returns false when no filters exist", () => {
    const table = createMockTable<FakeRow, number>({ columns: fakeColumns, rowKey: "id" });
    (table as Record<string, unknown>).filters = { value: [] };

    const state = makeState();
    const { tryUnravel } = useFilterUnravel(table, state);
    expect(tryUnravel()).toBe(false);
  });
});
