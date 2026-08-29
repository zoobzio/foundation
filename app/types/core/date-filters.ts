import type { CalendarProps, CalendarEmits } from "./calendar";
import type {
  CommandOption,
  CommandProps,
  CommandEmits,
} from "./command";
import type { FabProps } from "./fab";
import type { Passthrough, PT } from "../passthrough";
import type { PopoverProps, PopoverEmits } from "./popover";
import type {
  RangeCalendarProps,
  RangeCalendarEmits,
} from "./range-calendar";
import type { VNode } from "vue";

export type DateFilterOperator = "before" | "after" | "between";

export type DateFilter = {
  field: string;
  operator: DateFilterOperator;
  value: Date;
  endValue?: Date;
};

export type DateFieldConfig = {
  key: string;
  label: string;
};

export type DateFiltersPassthrough = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Passthrough<FabProps>;
  fieldCommand: Passthrough<CommandProps<CommandOption>, CommandEmits<CommandOption>>;
  operatorCommand: Passthrough<CommandProps<CommandOption>, CommandEmits<CommandOption>>;
  calendar: Passthrough<CalendarProps, CalendarEmits>;
  rangeCalendar: Passthrough<RangeCalendarProps, RangeCalendarEmits>;
};

export type DateFiltersProps = {
  modelValue?: DateFilter[];
  fields: DateFieldConfig[];
  addFilter: (filter: DateFilter) => void;
  pt?: PT<DateFiltersPassthrough>;
};

export type DateFiltersEmits = {};

export type DateFiltersContext = {
  fields: DateFieldConfig[];
  filters?: DateFilter[];
  activeCount: number;
  el: HTMLDivElement | null;
  settings: DateFiltersPassthrough;
};

export type DateFiltersSlots = {
  popover?: (props: DateFiltersContext) => VNode[];
  trigger?: (props: DateFiltersContext) => VNode[];
  root?: (props: DateFiltersContext) => VNode[];
  stepper?: (props: DateFiltersContext) => VNode[];
  fieldCommand?: (props: DateFiltersContext) => VNode[];
  operatorCommand?: (props: DateFiltersContext) => VNode[];
  calendarWrapper?: (props: DateFiltersContext) => VNode[];
  calendar?: (props: DateFiltersContext) => VNode[];
  actions?: (props: DateFiltersContext) => VNode[];
  applyButton?: (props: DateFiltersContext) => VNode[];
};
