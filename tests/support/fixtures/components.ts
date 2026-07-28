import { mount } from "@vue/test-utils";
import { passthrough } from "#foundation/utils/passthrough";
import { usePassthrough } from "#foundation/composables/passthrough";
import { commonStubs, coreStubs, rekaStubs, createScopedStub } from "#test/stubs";
import { fakeOptions } from "#test/support/data/options";
import { fakeMenuGroups } from "#test/support/data/menu";
import { fakeCommandGroups } from "#test/support/data/command";
import { fakeFacetGroups } from "#test/support/data/facets";
import { fakeDateFields } from "#test/support/data/date-filters";

import Autocomplete from "#foundation/components/data/filter/Autocomplete.vue";
import Accordion from "#foundation/components/core/accordion.vue";
import Avatar from "#foundation/components/core/avatar.vue";
import Calendar from "#foundation/components/core/calendar.vue";
import Checkbox from "#foundation/components/core/checkbox.vue";
import Command from "#foundation/components/core/command.vue";
import DateFilters from "#foundation/components/core/date-filters.vue";
import DatePicker from "#foundation/components/core/date-picker.vue";
import DateRangePicker from "#foundation/components/core/date-range-picker.vue";
import Dialog from "#foundation/components/core/dialog.vue";
import Fab from "#foundation/components/core/fab.vue";
import Facets from "#foundation/components/data/filter/Facets.vue";
import Hero from "#foundation/components/core/hero.vue";
import Keywords from "#foundation/components/data/filter/Keywords.vue";
import Listbox from "#foundation/components/core/listbox.vue";
import Menu from "#foundation/components/core/menu.vue";
import MultiSelect from "#foundation/components/core/multi-select.vue";
import Pagination from "#foundation/components/core/pagination.vue";
import Popover from "#foundation/components/core/popover.vue";
import Radio from "#foundation/components/core/radio.vue";
import RangeCalendar from "#foundation/components/core/range-calendar.vue";
import Scroller from "#foundation/components/core/scroller.vue";
import SegmentedControl from "#foundation/components/core/segmented-control.vue";
import Select from "#foundation/components/core/select.vue";
import Tabs from "#foundation/components/core/tabs.vue";
import TagsInput from "#foundation/components/core/tags-input.vue";
import Toast from "#foundation/components/core/toast.vue";
import Toaster from "#foundation/components/core/toaster.vue";
import Tooltip from "#foundation/components/core/tooltip.vue";

type MountProps = Record<string, unknown>;
type MountSlots = Record<string, string | ((...args: unknown[]) => unknown)>;

const withReka = (component: object, rekas: string[], defaultProps: MountProps = {}) =>
  (props: MountProps = {}, slots: MountSlots = {}) =>
    mount(component, {
      props: { ...defaultProps, ...props },
      slots,
      global: { stubs: { ...commonStubs, ...rekaStubs(...rekas) } },
    });

const composed = (component: object, defaultProps: MountProps = {}) =>
  (props: MountProps = {}, slots: MountSlots = {}) =>
    mount(component, {
      props: { ...defaultProps, ...props },
      slots,
      global: { stubs: { ...commonStubs, ...coreStubs } },
    });

const noop = () => {};

const fakeSuggestions = [
  { label: "Search", value: "__search", icon: "search" },
  { label: "Status", value: "status", hasChildren: true, icon: "filter" },
  { label: "Created", value: "created", hasChildren: true, icon: "calendar" },
];

export const mountAutocomplete = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Autocomplete, {
    props: { modelValue: "", suggestions: fakeSuggestions, ...props },
    slots,
    global: {
      stubs: {
        ...commonStubs,
        ...coreStubs,
        ClientOnly: { template: "<slot />" },
      },
      mocks: { passthrough, usePassthrough },
    },
  });

export const mountAccordion = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Accordion, {
    props: { items: fakeOptions, ...props },
    slots,
    global: {
      stubs: {
        ...commonStubs,
        ...rekaStubs("AccordionRoot", "AccordionHeader", "AccordionTrigger", "AccordionContent"),
        AccordionItem: createScopedStub("AccordionItem", { open: false }),
      },
    },
  });

export const mountAvatar = withReka(Avatar, ["AvatarRoot", "AvatarImage", "AvatarFallback"], {
  src: "https://example.com/avatar.png",
  alt: "Test user",
  fallback: "TU",
});

export const mountCalendar = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Calendar, {
    props: { ...props },
    slots,
    global: {
      stubs: {
        ...commonStubs,
        CalendarRoot: createScopedStub("CalendarRoot", {
          weekDays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
          grid: [{
            value: mockDate,
            rows: [[mockDate, mockDate, mockDate, mockDate, mockDate, mockDate, mockDate]],
          }],
        }),
        ...rekaStubs("CalendarHeader", "CalendarHeading", "CalendarGrid", "CalendarGridHead", "CalendarGridBody", "CalendarGridRow", "CalendarHeadCell", "CalendarCell", "CalendarCellTrigger", "CalendarPrev", "CalendarNext"),
      },
    },
  });

export const mountCheckbox = withReka(Checkbox, ["CheckboxRoot"]);

export const mountCommand = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Command, {
    props: { groups: fakeCommandGroups, ...props },
    slots,
    global: { stubs: { ...commonStubs, ...coreStubs, ...rekaStubs("ListboxRoot", "ListboxFilter", "ListboxContent", "ListboxGroup", "ListboxGroupLabel", "ListboxItem") } },
  });

export const mountDateFilters = composed(DateFilters, {
  fields: fakeDateFields,
  addFilter: noop,
  removeFilter: noop,
});

const mockDate = { toString: () => "2026-04-25", year: 2026, month: 4, day: 25, toDate: () => new Date() };
const mockMonth = { value: mockDate, rows: [[mockDate]] };
const mockSegments = [{ part: "literal", value: "/" }, { part: "day", value: "25" }];

export const mountDatePicker = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(DatePicker, {
    props: { ...props },
    slots,
    global: {
      stubs: {
        ...commonStubs,
        DatePickerField: createScopedStub("DatePickerField", { segments: mockSegments }),
        DatePickerCalendar: createScopedStub("DatePickerCalendar", { weekDays: ["Su"], grid: [mockMonth] }),
        ...rekaStubs("DatePickerRoot", "DatePickerInput", "DatePickerTrigger", "DatePickerContent", "DatePickerHeader", "DatePickerHeading", "DatePickerGrid", "DatePickerGridHead", "DatePickerGridBody", "DatePickerGridRow", "DatePickerHeadCell", "DatePickerCell", "DatePickerCellTrigger", "DatePickerPrev", "DatePickerNext"),
      },
    },
  });

export const mountDateRangePicker = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(DateRangePicker, {
    props: { ...props },
    slots,
    global: {
      stubs: {
        ...commonStubs,
        DateRangePickerField: createScopedStub("DateRangePickerField", { segments: { start: mockSegments, end: mockSegments } }),
        DateRangePickerCalendar: createScopedStub("DateRangePickerCalendar", { weekDays: ["Su"], grid: [mockMonth] }),
        ...rekaStubs("DateRangePickerRoot", "DateRangePickerInput", "DateRangePickerTrigger", "DateRangePickerContent", "DateRangePickerHeader", "DateRangePickerHeading", "DateRangePickerGrid", "DateRangePickerGridHead", "DateRangePickerGridBody", "DateRangePickerGridRow", "DateRangePickerHeadCell", "DateRangePickerCell", "DateRangePickerCellTrigger", "DateRangePickerPrev", "DateRangePickerNext"),
      },
    },
  });

export const mountDialog = withReka(Dialog, ["DialogRoot", "DialogPortal", "DialogOverlay", "DialogContent", "DialogTitle", "DialogDescription"], {
  title: "Test Dialog",
  description: "Test description",
});

export const mountFab = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Fab, {
    props: { icon: "home", ...props },
    slots,
    global: { stubs: commonStubs },
  });

export const mountFacets = composed(Facets, {
  groups: fakeFacetGroups,
});

export const mountHero = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Hero, {
    props: { tagline: "Test Tagline", ...props },
    slots,
    global: { stubs: commonStubs },
  });

export const mountKeywords = composed(Keywords);

export const mountListbox = withReka(Listbox, ["ListboxRoot", "ListboxContent", "ListboxItem"], {
  items: fakeOptions,
});

export const mountMenu = withReka(Menu, ["DropdownMenuRoot", "DropdownMenuTrigger", "DropdownMenuPortal", "DropdownMenuContent", "DropdownMenuGroup", "DropdownMenuLabel", "DropdownMenuItem", "DropdownMenuSeparator"], {
  groups: fakeMenuGroups,
});

export const mountMultiSelect = withReka(
  MultiSelect,
  ["SelectRoot", "SelectTrigger", "SelectPortal", "SelectContent", "SelectItem", "SelectItemText", "Checkbox"],
  { items: fakeOptions },
);

export const mountPagination = composed(Pagination, {
  page: 1,
  size: 25,
  count: 10,
  total: 250,
});

export const mountPopover = withReka(Popover, ["PopoverRoot", "PopoverAnchor", "PopoverTrigger", "PopoverPortal", "PopoverContent", "PopoverArrow", "PopoverClose"]);

export const mountRadio = withReka(Radio, ["RadioGroupRoot", "RadioGroupItem", "RadioGroupIndicator"], {
  options: fakeOptions,
});

export const mountRangeCalendar = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(RangeCalendar, {
    props: { ...props },
    slots,
    global: {
      stubs: {
        ...commonStubs,
        RangeCalendarRoot: createScopedStub("RangeCalendarRoot", {
          weekDays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
          grid: [{
            value: mockDate,
            rows: [[mockDate, mockDate, mockDate, mockDate, mockDate, mockDate, mockDate]],
          }],
        }),
        ...rekaStubs("RangeCalendarHeader", "RangeCalendarHeading", "RangeCalendarGrid", "RangeCalendarGridHead", "RangeCalendarGridBody", "RangeCalendarGridRow", "RangeCalendarHeadCell", "RangeCalendarCell", "RangeCalendarCellTrigger", "RangeCalendarPrev", "RangeCalendarNext"),
      },
    },
  });

export const mountScroller = withReka(Scroller, ["ScrollAreaRoot", "ScrollAreaViewport", "ScrollAreaScrollbar", "ScrollAreaThumb", "ScrollAreaCorner"]);

export const mountSegmentedControl = withReka(SegmentedControl, ["ToggleGroupRoot", "ToggleGroupItem"], {
  options: fakeOptions,
});

export const mountSelect = withReka(Select, ["SelectRoot", "SelectTrigger", "SelectPortal", "SelectContent", "SelectItem", "SelectItemText"], {
  options: fakeOptions,
});

export const mountTabs = withReka(Tabs, ["TabsRoot", "TabsList", "TabsTrigger", "TabsContent"], {
  tabs: fakeOptions,
});

export const mountTagsInput = withReka(TagsInput, ["TagsInputRoot", "TagsInputItem", "TagsInputItemText", "TagsInputItemDelete", "TagsInputInput"]);

export const mountToast = withReka(Toast, ["ToastRoot", "ToastTitle", "ToastDescription", "ToastClose"], {
  title: "Test Toast",
  description: "Test description",
});

export const mountToaster = withReka(Toaster, ["ToastProvider", "ToastViewport"]);

export const mountTooltip = withReka(Tooltip, ["TooltipRoot", "TooltipTrigger", "TooltipPortal", "TooltipContent"], {
  content: "Tooltip text",
});
