import type { CalendarProps, CalendarEmits } from "./calendar";
import type { CommandOption, CommandProps, CommandEmits } from "./command";
import type { FabProps } from "./fab";
import type { PT, Rendered } from "../passthrough";
import type { Definition } from "../definition";
import type { PopoverProps, PopoverEmits } from "./popover";
import type { RangeCalendarProps, RangeCalendarEmits } from "./range-calendar";
import type { VNode } from "vue";

/**
 * How a date filter compares its field to its value.
 */
export type DateFilterOperator = "before" | "after" | "between";

/**
 * A date filter. `endValue` applies to the `between` operator.
 */
export type DateFilter = {
  field: string;
  operator: DateFilterOperator;
  value: Date;
  endValue?: Date;
};

/**
 * A date field that can be filtered.
 */
export type DateFieldConfig = {
  key: string;
  label: string;
};

/**
 * The parts of the date filters that accept passthrough.
 */
export type DateFiltersPassthrough = {
  popover: Rendered<PopoverProps, PopoverEmits>;
  trigger: Rendered<FabProps>;
  fieldCommand: Rendered<
    CommandProps<CommandOption>,
    CommandEmits<CommandOption>
  >;
  operatorCommand: Rendered<
    CommandProps<CommandOption>,
    CommandEmits<CommandOption>
  >;
  calendar: Rendered<CalendarProps, CalendarEmits>;
  rangeCalendar: Rendered<RangeCalendarProps, RangeCalendarEmits>;
};

/**
 * Props of the date filters. `addFilter` receives each applied filter.
 */
export type DateFiltersProps = {
  modelValue?: DateFilter[];
  fields: DateFieldConfig[];
  addFilter: (filter: DateFilter) => void;
  pt?: PT<DateFiltersPassthrough>;
};

/**
 * The date filters have no emits.
 */
export type DateFiltersEmits = {};

/**
 * The date filters view model, served to `defineExpose` and the slots.
 * `activeCount` is the number of filters.
 */
export type DateFiltersContext = {
  fields: DateFieldConfig[];
  filters?: DateFilter[];
  activeCount: number;
  el: HTMLDivElement | null;
  settings: DateFiltersPassthrough;
};

/**
 * Slots of the date filters. Each slot receives the context.
 */
export type DateFiltersSlots = {
  popover?: (props: DateFiltersContext) => VNode[];
  trigger?: (props: DateFiltersContext) => VNode[];
  root?: (props: DateFiltersContext) => VNode[];
  stepper?: (props: DateFiltersContext) => VNode[];
  stepSeparator?: (props: DateFiltersContext) => VNode[];
  fieldCommand?: (props: DateFiltersContext) => VNode[];
  operatorCommand?: (props: DateFiltersContext) => VNode[];
  calendarWrapper?: (props: DateFiltersContext) => VNode[];
  calendar?: (props: DateFiltersContext) => VNode[];
  actions?: (props: DateFiltersContext) => VNode[];
  applyButton?: (props: DateFiltersContext) => VNode[];
  triggerPrepend?: (props: DateFiltersContext) => VNode[];
  triggerAppend?: (props: DateFiltersContext) => VNode[];
};

/**
 * A date filters instance as data: props plus emit listeners.
 */
export type DateFiltersDefinition = Definition<
  DateFiltersProps,
  DateFiltersEmits
>;
