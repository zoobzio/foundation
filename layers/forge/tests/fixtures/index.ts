import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { passthrough } from "../../../../layers/alloy/app/utils/passthrough";
import { usePassthrough } from "../../../../layers/alloy/app/composables/passthrough";
import { formatCell } from "../../app/utils/format-cell";
import { formatFilter } from "../../app/utils/format-filter";
import { oreStubs, alloyStubs, forgeStubs } from "../stubs";
import { createMockTable } from "../helpers/mock-table";
import { createMockPreview } from "../helpers/mock-preview";
import { createMockDeck } from "../helpers/mock-deck";
import { createMockForm } from "../helpers/mock-form";
import { fakeColumns, fakeRows, fakeBulkActions } from "../data/table";
import type { FakeRow } from "../data/table";
import type { TableFilter, RowAction, BulkAction } from "../../app/types/data-table";
import type { Deck } from "../../app/types/data-deck";
import type { Form } from "../../app/types/data-form";
import type { FakeFormData } from "../helpers/mock-form";

// Generic SFCs need a DefineComponent cast for Vue Test Utils
const Widget = (await import("../../app/components/Data/Table/Widget.vue")).default as DefineComponent;
const Head = (await import("../../app/components/Data/Table/Head.vue")).default as DefineComponent;
const Body = (await import("../../app/components/Data/Table/Body.vue")).default as DefineComponent;
const BulkActions = (await import("../../app/components/Data/Table/BulkActions.vue")).default as DefineComponent;
const Search = (await import("../../app/components/Data/Table/Search.vue")).default as DefineComponent;
const Columns = (await import("../../app/components/Data/Table/Columns.vue")).default as DefineComponent;
const FilterHelp = (await import("../../app/components/Data/Table/FilterHelp.vue")).default as DefineComponent;
const Filters = (await import("../../app/components/Data/Table/Filters.vue")).default as DefineComponent;

const PreviewWidget = (await import("../../app/components/Data/Preview/Widget.vue")).default as DefineComponent;
const PreviewFields = (await import("../../app/components/Data/Preview/Fields.vue")).default as DefineComponent;
const PreviewContent = (await import("../../app/components/Data/Preview/Content.vue")).default as DefineComponent;

const DeckWidget = (await import("../../app/components/Data/Deck/Widget.vue")).default as DefineComponent;
const DeckToolbar = (await import("../../app/components/Data/Deck/Toolbar.vue")).default as DefineComponent;
const DeckFeed = (await import("../../app/components/Data/Deck/Feed.vue")).default as DefineComponent;

const FormWidget = (await import("../../app/components/Data/Form/Widget.vue")).default as DefineComponent;
const FormField = (await import("../../app/components/Data/Form/Field.vue")).default as DefineComponent;

type MountProps = Record<string, unknown>;
type MountSlots = Record<string, string | ((...args: unknown[]) => unknown)>;

const stubs = { ...oreStubs, ...alloyStubs, ...forgeStubs };
const mocks = { passthrough, usePassthrough, formatCell, formatFilter };

interface MockTableOverrides {
  actions?: RowAction<FakeRow>[];
  bulkActions?: BulkAction<number>[];
  filters?: TableFilter[];
}

/** Creates a default mock table for tests */
export const mockTable = (overrides: MockTableOverrides = {}) =>
  createMockTable<FakeRow, number>({ columns: fakeColumns, rows: fakeRows, rowKey: "id", ...overrides });

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
