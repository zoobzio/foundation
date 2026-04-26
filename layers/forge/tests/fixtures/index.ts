import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { passthrough } from "../../../../layers/alloy/app/utils/passthrough";
import { usePassthrough } from "../../../../layers/alloy/app/composables/passthrough";
import { formatCell } from "../../app/utils/format-cell";
import { formatFilter } from "../../app/utils/format-filter";
import { oreStubs, alloyStubs, createStub, createAllSlotsStub } from "../../../../packages/testing/helpers/stubs";
import { createMockTable } from "../../../../packages/testing/helpers/mock-table";
import { fakeColumns, fakeRows, fakeBulkActions } from "../../../../packages/testing/data/table";
import type { FakeRow } from "../../../../packages/testing/data/table";
import type { Table } from "../../app/types/data-table";

// Generic SFCs need a DefineComponent cast for Vue Test Utils
const Widget = (await import("../../app/components/Data/Table/Widget.vue")).default as DefineComponent;
const Head = (await import("../../app/components/Data/Table/Head.vue")).default as DefineComponent;
const Body = (await import("../../app/components/Data/Table/Body.vue")).default as DefineComponent;
const BulkActions = (await import("../../app/components/Data/Table/BulkActions.vue")).default as DefineComponent;
const Search = (await import("../../app/components/Data/Table/Search.vue")).default as DefineComponent;
const Columns = (await import("../../app/components/Data/Table/Columns.vue")).default as DefineComponent;
const FilterHelp = (await import("../../app/components/Data/Table/FilterHelp.vue")).default as DefineComponent;
const Filters = (await import("../../app/components/Data/Table/Filters.vue")).default as DefineComponent;

type MountProps = Record<string, unknown>;
type MountSlots = Record<string, string | ((...args: unknown[]) => unknown)>;

/** Stubs for forge sub-components when testing Widget */
const forgeStubs = {
  DataTableHead: createStub("DataTableHead"),
  DataTableBody: createAllSlotsStub("DataTableBody"),
  DataTableFilters: createStub("DataTableFilters"),
  DataTableColumns: createStub("DataTableColumns"),
  DataTableSearch: createStub("DataTableSearch"),
  DataTableBulkActions: createStub("DataTableBulkActions"),
  DataTableFilterHelp: createStub("DataTableFilterHelp"),
};

const stubs = { ...oreStubs, ...alloyStubs, ...forgeStubs };
const mocks = { passthrough, usePassthrough, formatCell, formatFilter };

/** Creates a default mock table for tests */
export const mockTable = (overrides: Partial<Table<FakeRow, number>> = {}) =>
  ({ ...createMockTable({ columns: fakeColumns, rows: fakeRows, rowKey: "id" }), ...overrides }) as Table<FakeRow, number>;

/** Shallow-mount a forge component with table prop + stubs */
const forge = (component: DefineComponent, defaultProps: MountProps = {}) =>
  (props: MountProps = {}, slots: MountSlots = {}) =>
    shallowMount(component, {
      props: { table: mockTable(), ...defaultProps, ...props },
      slots,
      global: { stubs, mocks },
    });

export const mountWidget = (props: MountProps = {}, slots: MountSlots = {}) =>
  shallowMount(Widget, {
    props: { table: mockTable(), ...props },
    slots,
    global: { stubs, mocks },
  });

export const mountHead = forge(Head);
export const mountBody = forge(Body);
export const mountBulkActions = (props: MountProps = {}, slots: MountSlots = {}) => {
  const table = mockTable({ bulkActions: fakeBulkActions });
  table.selected.value = new Set([1, 2]);
  return shallowMount(BulkActions, {
    props: { table, ...props },
    slots,
    global: { stubs, mocks },
  });
};
export const mountSearch = forge(Search);
export const mountColumns = forge(Columns);

export const mountFilterHelp = (props: MountProps = {}, slots: MountSlots = {}) =>
  shallowMount(FilterHelp, {
    props: { columns: fakeColumns, ...props },
    slots,
    global: { stubs, mocks },
  });

export const mountFilters = forge(Filters);
