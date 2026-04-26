import { mount } from "@vue/test-utils";
import { oreStubs, alloyStubs, rekaStubs, createScopedStub } from "../../../../packages/testing/helpers/stubs";
import { fakeOptions } from "../../../../packages/testing/data/options";
import { fakeMenuGroups } from "../../../../packages/testing/data/menu";
import { fakeCommandGroups } from "../../../../packages/testing/data/command";
import { fakeFacetGroups } from "../../../../packages/testing/data/facets";
import { fakeDateFields } from "../../../../packages/testing/data/date-filters";

import Accordion from "../../app/components/Accordion.vue";
import Avatar from "../../app/components/Avatar.vue";
import Calendar from "../../app/components/Calendar.vue";
import Checkbox from "../../app/components/Checkbox.vue";
import Command from "../../app/components/Command.vue";
import DateFilters from "../../app/components/DateFilters.vue";
import DatePicker from "../../app/components/DatePicker.vue";
import DateRangePicker from "../../app/components/DateRangePicker.vue";
import Dialog from "../../app/components/Dialog.vue";
import Fab from "../../app/components/Fab.vue";
import Facets from "../../app/components/Facets.vue";
import Hero from "../../app/components/Hero.vue";
import Keywords from "../../app/components/Keywords.vue";
import Listbox from "../../app/components/Listbox.vue";
import Menu from "../../app/components/Menu.vue";
import MultiSelect from "../../app/components/MultiSelect.vue";
import Pagination from "../../app/components/Pagination.vue";
import Popover from "../../app/components/Popover.vue";
import Radio from "../../app/components/Radio.vue";
import RangeCalendar from "../../app/components/RangeCalendar.vue";
import Scroller from "../../app/components/Scroller.vue";
import SegmentedControl from "../../app/components/SegmentedControl.vue";
import Select from "../../app/components/Select.vue";
import Tabs from "../../app/components/Tabs.vue";
import TagsInput from "../../app/components/TagsInput.vue";
import Toast from "../../app/components/Toast.vue";
import Toaster from "../../app/components/Toaster.vue";
import Tooltip from "../../app/components/Tooltip.vue";

type MountProps = Record<string, unknown>;
type MountSlots = Record<string, string | ((...args: unknown[]) => unknown)>;

const alloy = (component: object, rekas: string[], defaultProps: MountProps = {}) =>
  (props: MountProps = {}, slots: MountSlots = {}) =>
    mount(component, {
      props: { ...defaultProps, ...props },
      slots,
      global: { stubs: { ...oreStubs, ...rekaStubs(...rekas) } },
    });

const alloyComposed = (component: object, defaultProps: MountProps = {}) =>
  (props: MountProps = {}, slots: MountSlots = {}) =>
    mount(component, {
      props: { ...defaultProps, ...props },
      slots,
      global: { stubs: { ...oreStubs, ...alloyStubs } },
    });

const noop = () => {};

export const mountAccordion = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Accordion, {
    props: { items: fakeOptions, ...props },
    slots,
    global: {
      stubs: {
        ...oreStubs,
        ...rekaStubs("AccordionRoot", "AccordionHeader", "AccordionTrigger", "AccordionContent"),
        AccordionItem: createScopedStub("AccordionItem", { open: false }),
      },
    },
  });

export const mountAvatar = alloy(Avatar, ["AvatarRoot", "AvatarImage", "AvatarFallback"], {
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
        ...oreStubs,
        CalendarRoot: createScopedStub("CalendarRoot", { weekDays: ["Su", "Mo"], grid: [] }),
        ...rekaStubs("CalendarHeader", "CalendarHeading", "CalendarGrid", "CalendarGridHead", "CalendarGridBody", "CalendarGridRow", "CalendarHeadCell", "CalendarCell", "CalendarCellTrigger", "CalendarPrev", "CalendarNext"),
      },
    },
  });

export const mountCheckbox = alloy(Checkbox, ["CheckboxRoot"]);

export const mountCommand = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Command, {
    props: { groups: fakeCommandGroups, ...props },
    slots,
    global: { stubs: { ...oreStubs, ...alloyStubs, ...rekaStubs("ListboxRoot", "ListboxFilter", "ListboxContent", "ListboxGroup", "ListboxGroupLabel", "ListboxItem") } },
  });

export const mountDateFilters = alloyComposed(DateFilters, {
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
        ...oreStubs,
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
        ...oreStubs,
        DateRangePickerField: createScopedStub("DateRangePickerField", { segments: { start: mockSegments, end: mockSegments } }),
        DateRangePickerCalendar: createScopedStub("DateRangePickerCalendar", { weekDays: ["Su"], grid: [mockMonth] }),
        ...rekaStubs("DateRangePickerRoot", "DateRangePickerInput", "DateRangePickerTrigger", "DateRangePickerContent", "DateRangePickerHeader", "DateRangePickerHeading", "DateRangePickerGrid", "DateRangePickerGridHead", "DateRangePickerGridBody", "DateRangePickerGridRow", "DateRangePickerHeadCell", "DateRangePickerCell", "DateRangePickerCellTrigger", "DateRangePickerPrev", "DateRangePickerNext"),
      },
    },
  });

export const mountDialog = alloy(Dialog, ["DialogRoot", "DialogPortal", "DialogOverlay", "DialogContent", "DialogTitle", "DialogDescription"], {
  title: "Test Dialog",
  description: "Test description",
});

export const mountFab = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Fab, {
    props: { icon: "home", ...props },
    slots,
    global: { stubs: { ...oreStubs, ...alloyStubs, ...rekaStubs("Primitive") } },
  });

export const mountFacets = alloyComposed(Facets, {
  groups: fakeFacetGroups,
});

export const mountHero = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(Hero, {
    props: { tagline: "Test Tagline", ...props },
    slots,
    global: { stubs: oreStubs },
  });

export const mountKeywords = alloyComposed(Keywords);

export const mountListbox = alloy(Listbox, ["ListboxRoot", "ListboxContent", "ListboxItem"], {
  items: fakeOptions,
});

export const mountMenu = alloy(Menu, ["DropdownMenuRoot", "DropdownMenuTrigger", "DropdownMenuPortal", "DropdownMenuContent", "DropdownMenuGroup", "DropdownMenuLabel", "DropdownMenuItem", "DropdownMenuSeparator"], {
  groups: fakeMenuGroups,
});

export const mountMultiSelect = alloyComposed(MultiSelect, {
  items: fakeOptions,
});

export const mountPagination = alloyComposed(Pagination, {
  page: 1,
  pageSize: 25,
  pageCount: 10,
  total: 250,
  goToPage: noop,
});

export const mountPopover = alloy(Popover, ["PopoverRoot", "PopoverAnchor", "PopoverTrigger", "PopoverPortal", "PopoverContent", "PopoverArrow", "PopoverClose"]);

export const mountRadio = alloy(Radio, ["RadioGroupRoot", "RadioGroupItem", "RadioGroupIndicator"], {
  options: fakeOptions,
});

export const mountRangeCalendar = (props: MountProps = {}, slots: MountSlots = {}) =>
  mount(RangeCalendar, {
    props: { ...props },
    slots,
    global: {
      stubs: {
        ...oreStubs,
        RangeCalendarRoot: createScopedStub("RangeCalendarRoot", { weekDays: ["Su", "Mo"], grid: [] }),
        ...rekaStubs("RangeCalendarHeader", "RangeCalendarHeading", "RangeCalendarGrid", "RangeCalendarGridHead", "RangeCalendarGridBody", "RangeCalendarGridRow", "RangeCalendarHeadCell", "RangeCalendarCell", "RangeCalendarCellTrigger", "RangeCalendarPrev", "RangeCalendarNext"),
      },
    },
  });

export const mountScroller = alloy(Scroller, ["ScrollAreaRoot", "ScrollAreaViewport", "ScrollAreaScrollbar", "ScrollAreaThumb", "ScrollAreaCorner"]);

export const mountSegmentedControl = alloy(SegmentedControl, ["ToggleGroupRoot", "ToggleGroupItem"], {
  options: fakeOptions,
});

export const mountSelect = alloy(Select, ["SelectRoot", "SelectTrigger", "SelectPortal", "SelectContent", "SelectItem", "SelectItemText"], {
  options: fakeOptions,
});

export const mountTabs = alloy(Tabs, ["TabsRoot", "TabsList", "TabsTrigger", "TabsContent"], {
  tabs: fakeOptions,
});

export const mountTagsInput = alloy(TagsInput, ["TagsInputRoot", "TagsInputItem", "TagsInputItemText", "TagsInputItemDelete", "TagsInputInput"]);

export const mountToast = alloy(Toast, ["ToastRoot", "ToastTitle", "ToastDescription", "ToastClose"], {
  title: "Test Toast",
  description: "Test description",
});

export const mountToaster = alloy(Toaster, ["ToastProvider", "ToastViewport"]);

export const mountTooltip = alloy(Tooltip, ["TooltipRoot", "TooltipTrigger", "TooltipPortal", "TooltipContent"], {
  content: "Tooltip text",
});
