import { defineComponent, h } from "vue";
import { createStub, createAllSlotsStub } from "@zoobz-io/ore/stubs";

export { createStub, createScopedStub, createAllSlotsStub, rekaStubs, oreStubs } from "@zoobz-io/ore/stubs";

export const alloyStubs = {
  Accordion: createStub("Accordion"),
  Autocomplete: defineComponent({
    name: "Autocomplete",
    inheritAttrs: false,
    setup(_, { attrs, slots, expose }) {
      expose({ focus: () => {} });
      return () => h("div", { ...attrs }, slots.default?.());
    },
  }),
  Avatar: createStub("Avatar"),
  Calendar: createStub("Calendar"),
  Checkbox: createStub("Checkbox"),
  CodeView: createStub("CodeView"),
  Command: createStub("Command"),
  DateFilters: createStub("DateFilters"),
  DatePicker: createStub("DatePicker"),
  DateRangePicker: createStub("DateRangePicker"),
  Dialog: createAllSlotsStub("Dialog"),
  Fab: createStub("Fab"),
  Facets: createStub("Facets"),
  Hero: createStub("Hero"),
  Keywords: createStub("Keywords"),
  Listbox: createStub("Listbox"),
  Markdown: createStub("Markdown"),
  Menu: createStub("Menu"),
  MultiSelect: createStub("MultiSelect"),
  Pagination: createStub("Pagination"),
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
