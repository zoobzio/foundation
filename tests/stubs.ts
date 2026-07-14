import { defineComponent, h, type VNode } from "vue";

export const createStub = (name: string, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs }, slots.default?.());
    },
  });

export const createScopedStub = (name: string, slotProps: Record<string, unknown> = {}, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs }, slots.default?.(slotProps));
    },
  });

export const createAllSlotsStub = (name: string, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => {
        const children: VNode[] = [];
        for (const slotFn of Object.values(slots)) {
          const nodes = slotFn?.();
          if (nodes) children.push(...nodes);
        }
        return h(tag, { ...attrs }, children);
      };
    },
  });

// reka-ui primitives (not a foundation dir — kept as-is).
export const rekaStubs = (...names: string[]) =>
  Object.fromEntries(names.map((name) => [name, createStub(name)]));

// --- components/common (HTML element wrappers + slot-through primitives) ---
export const commonStubs = {
  Icon: createStub("Icon", "i"),
  Group: createStub("Group", "div"),
  Button: createStub("Button", "button"),
  Span: createStub("Span", "span"),
  Label: createStub("Label", "label"),
  Caption: createStub("Caption", "div"),
  Section: createStub("Section", "section"),
  H1: createStub("H1", "h1"),
  H2: createStub("H2", "h2"),
  H3: createStub("H3", "h3"),
  H4: createStub("H4", "h4"),
  H5: createStub("H5", "h5"),
  H6: createStub("H6", "h6"),
  Em: createStub("Em", "em"),
  P: createStub("P", "p"),
  Kbd: createStub("Kbd", "kbd"),
  Input: createStub("Input", "input"),
  Table: createStub("Table", "table"),
  Thead: createStub("Thead", "thead"),
  Tbody: createStub("Tbody", "tbody"),
  Tr: createStub("Tr", "tr"),
  Th: createStub("Th", "th"),
  Td: createStub("Td", "td"),
  Anchor: createStub("Anchor", "a"),
  Img: createStub("Img", "img"),
  Chip: createStub("Chip", "button"),
  Article: createStub("Article", "article"),
  Strong: createStub("Strong", "strong"),
  Del: createStub("Del", "del"),
  Blockquote: createStub("Blockquote", "blockquote"),
  Ul: createStub("Ul", "ul"),
  Ol: createStub("Ol", "ol"),
  Li: createStub("Li", "li"),
  Code: createStub("Code", "code"),
  Pre: createStub("Pre", "pre"),
  Hr: createStub("Hr", "hr"),
  Textarea: createStub("Textarea", "textarea"),
  Fieldset: createStub("Fieldset", "fieldset"),
  Header: createStub("Header", "header"),
  Footer: createStub("Footer", "footer"),
  Autocomplete: defineComponent({
    name: "Autocomplete",
    inheritAttrs: false,
    setup(_, { attrs, slots, expose }) {
      expose({ focus: () => {} });
      return () => h("div", { ...attrs }, slots.default?.());
    },
  }),
  CodeView: createStub("CodeView"),
  Facets: createStub("Facets"),
  Hero: createStub("Hero"),
  Keywords: createStub("Keywords"),
  Markdown: createStub("Markdown"),
  MultiSelect: createStub("MultiSelect"),
  Pagination: createStub("Pagination"),
} as const;

// --- components/core (stateful / interactive components) ---
export const coreStubs = {
  Accordion: createStub("Accordion"),
  Avatar: createStub("Avatar"),
  Calendar: createStub("Calendar"),
  Checkbox: createStub("Checkbox"),
  Command: createStub("Command"),
  DateFilters: createStub("DateFilters"),
  DatePicker: createStub("DatePicker"),
  DateRangePicker: createStub("DateRangePicker"),
  Dialog: createAllSlotsStub("Dialog"),
  Fab: createStub("Fab"),
  Listbox: createStub("Listbox"),
  Menu: createStub("Menu"),
  Popover: createAllSlotsStub("Popover"),
  Radio: createStub("Radio"),
  RangeCalendar: createStub("RangeCalendar"),
  Scroller: createAllSlotsStub("Scroller"),
  SegmentedControl: createStub("SegmentedControl"),
  Select: createStub("Select"),
  Tabs: createStub("Tabs"),
  TagsInput: createAllSlotsStub("TagsInput"),
  Toast: createStub("Toast"),
  Toaster: createStub("Toaster"),
  Tooltip: createStub("Tooltip"),
} as const;

// --- components/data (factory-driven data widgets) ---
export const dataStubs = {
  DataTableWidget: createStub("DataTableWidget"),
  DataTableHead: createStub("DataTableHead"),
  DataTableBody: createAllSlotsStub("DataTableBody"),
  DataTableFilters: createStub("DataTableFilters"),
  DataTableColumns: createStub("DataTableColumns"),
  DataTableSearch: createStub("DataTableSearch"),
  DataTableBulkActions: createStub("DataTableBulkActions"),
  DataTableFilterHelp: createStub("DataTableFilterHelp"),
  DataChartWidget: createStub("DataChartWidget"),
  DataChartCanvas: createStub("DataChartCanvas"),
  DataPreviewWidget: createStub("DataPreviewWidget"),
  DataPreviewFields: createAllSlotsStub("DataPreviewFields"),
  DataPreviewContent: createStub("DataPreviewContent"),
  DataDeckWidget: createStub("DataDeckWidget"),
  DataDeckToolbar: createStub("DataDeckToolbar"),
  DataDeckFeed: createAllSlotsStub("DataDeckFeed"),
  DataFormWidget: createStub("DataFormWidget"),
  DataFormField: createAllSlotsStub("DataFormField"),
} as const;
