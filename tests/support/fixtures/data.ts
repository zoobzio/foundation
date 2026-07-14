import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { passthrough } from "#foundation/utils/passthrough";
import { usePassthrough } from "#foundation/composables/passthrough";
import { formatCell } from "#foundation/utils/format-cell";
import { formatFilter } from "#foundation/utils/format-filter";
import { commonStubs, coreStubs, dataStubs } from "#test/stubs";
import { createMockTable } from "#test/support/helpers/mock-table";
import { createMockPreview } from "#test/support/helpers/mock-preview";
import { createMockDeck } from "#test/support/helpers/mock-deck";
import { createMockForm } from "#test/support/helpers/mock-form";
import { fakeColumns, fakeRows, fakeBulkActions } from "#test/support/data/table";
import type { FakeRow } from "#test/support/data/table";
import type { TableFilter, RowAction, BulkAction } from "#foundation/types/data/table";
import type { Deck } from "#foundation/types/data/deck";
import type { Form } from "#foundation/types/data/form";
import type { FakeFormData } from "#test/support/helpers/mock-form";

// Generic SFCs need a DefineComponent cast for Vue Test Utils
const Widget = (await import("#foundation/components/data/table/Widget.vue")).default as DefineComponent;
const Head = (await import("#foundation/components/data/table/Head.vue")).default as DefineComponent;
const Body = (await import("#foundation/components/data/table/Body.vue")).default as DefineComponent;
const BulkActions = (await import("#foundation/components/data/table/BulkActions.vue")).default as DefineComponent;
const Search = (await import("#foundation/components/data/table/Search.vue")).default as DefineComponent;
const Columns = (await import("#foundation/components/data/table/Columns.vue")).default as DefineComponent;
const FilterHelp = (await import("#foundation/components/data/table/FilterHelp.vue")).default as DefineComponent;
const Filters = (await import("#foundation/components/data/table/Filters.vue")).default as DefineComponent;

const PreviewWidget = (await import("#foundation/components/data/preview/Widget.vue")).default as DefineComponent;
const PreviewFields = (await import("#foundation/components/data/preview/Fields.vue")).default as DefineComponent;
const PreviewContent = (await import("#foundation/components/data/preview/Content.vue")).default as DefineComponent;

const DeckWidget = (await import("#foundation/components/data/deck/Widget.vue")).default as DefineComponent;
const DeckToolbar = (await import("#foundation/components/data/deck/Toolbar.vue")).default as DefineComponent;
const DeckFeed = (await import("#foundation/components/data/deck/Feed.vue")).default as DefineComponent;

const FormWidget = (await import("#foundation/components/data/form/Widget.vue")).default as DefineComponent;
const FormField = (await import("#foundation/components/data/form/Field.vue")).default as DefineComponent;

type MountProps = Record<string, unknown>;
type MountSlots = Record<string, string | ((...args: unknown[]) => unknown)>;

const stubs = { ...commonStubs, ...coreStubs, ...dataStubs };
const mocks = { passthrough, usePassthrough, formatCell, formatFilter };

interface MockTableOverrides {
  actions?: RowAction<FakeRow>[];
  bulkActions?: BulkAction<number>[];
  filters?: TableFilter[];
}

/** Creates a default mock table for tests */
export const mockTable = (overrides: MockTableOverrides = {}) =>
  createMockTable<FakeRow, number>({ columns: fakeColumns, rows: fakeRows, rowKey: "id", ...overrides });

/** Shallow-mount a data widget with table prop + stubs */
const dataWidget = (component: DefineComponent, defaultProps: MountProps = {}) =>
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

export const mountHead = dataWidget(Head);
export const mountBody = dataWidget(Body);
export const mountBulkActions = (props: MountProps = {}, slots: MountSlots = {}) => {
  const table = mockTable({ bulkActions: fakeBulkActions });
  table.selected.value = new Set([1, 2]);
  return shallowMount(BulkActions, {
    props: { table, ...props },
    slots,
    global: { stubs, mocks },
  });
};
export const mountSearch = dataWidget(Search);
export const mountColumns = dataWidget(Columns);

export const mountFilterHelp = (props: MountProps = {}, slots: MountSlots = {}) =>
  shallowMount(FilterHelp, {
    props: { columns: fakeColumns, ...props },
    slots,
    global: { stubs, mocks },
  });

export const mountFilters = dataWidget(Filters);

// ---------------------------------------------------------------------------
// Data Preview
// ---------------------------------------------------------------------------

export const mockPreview = createMockPreview;

export const mountPreviewWidget = (props: MountProps = {}, slots: MountSlots = {}) =>
  shallowMount(PreviewWidget, {
    props: { preview: createMockPreview(), ...props },
    slots,
    global: { stubs, mocks },
  });

const forgePreview = (component: DefineComponent, defaultProps: MountProps = {}) =>
  (props: MountProps = {}, slots: MountSlots = {}) =>
    shallowMount(component, {
      props: { preview: createMockPreview(), ...defaultProps, ...props },
      slots,
      global: { stubs, mocks },
    });

export const mountPreviewFields = forgePreview(PreviewFields);
export const mountPreviewContent = forgePreview(PreviewContent);

// ---------------------------------------------------------------------------
// Data Deck
// ---------------------------------------------------------------------------

export const mockDeck = (overrides: Partial<Deck<FakeRow>> = {}) =>
  ({ ...createMockDeck<FakeRow>({ rowKey: "id", items: fakeRows }), ...overrides }) as Deck<FakeRow>;

export const mountDeckWidget = (props: MountProps = {}, slots: MountSlots = {}) =>
  shallowMount(DeckWidget, {
    props: { deck: mockDeck(), ...props },
    slots,
    global: { stubs, mocks },
  });

const forgeDeck = (component: DefineComponent, defaultProps: MountProps = {}) =>
  (props: MountProps = {}, slots: MountSlots = {}) =>
    shallowMount(component, {
      props: { deck: mockDeck(), ...defaultProps, ...props },
      slots,
      global: { stubs, mocks },
    });

export const mountDeckToolbar = forgeDeck(DeckToolbar);
export const mountDeckFeed = forgeDeck(DeckFeed);

// ---------------------------------------------------------------------------
// Data Form
// ---------------------------------------------------------------------------

export const mockForm = (overrides: Partial<Form<FakeFormData>> = {}) =>
  ({ ...createMockForm(), ...overrides }) as Form<FakeFormData>;

export const mountFormWidget = (props: MountProps = {}, slots: MountSlots = {}) =>
  shallowMount(FormWidget, {
    props: { form: mockForm(), ...props },
    slots,
    global: { stubs, mocks },
  });

export const mountFormField = (props: MountProps = {}, slots: MountSlots = {}) =>
  shallowMount(FormField, {
    props: {
      form: createMockForm(),
      field: { key: "name", type: "text", label: "Name", colspan: 6 },
      ...props,
    },
    slots,
    global: { stubs, mocks },
  });
