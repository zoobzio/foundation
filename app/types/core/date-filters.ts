import type { ButtonProps, ButtonEmits } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { CalendarProps, CalendarEmits } from "#foundation/types/core/calendar";
import type {
  CommandOption,
  CommandProps,
  CommandEmits,
} from "#foundation/types/core/command";
import type { FabProps } from "#foundation/types/core/fab";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { PopoverProps, PopoverEmits } from "#foundation/types/core/popover";
import type {
  RangeCalendarProps,
  RangeCalendarEmits,
} from "#foundation/types/core/range-calendar";
import type { ComponentPublicInstance, VNode } from "vue";

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
  root: Passthrough<GroupProps>;
  stepper: Passthrough<GroupProps>;
  stepSeparator: Passthrough<IconProps>;
  fieldCommand: Passthrough<CommandProps<CommandOption>, CommandEmits<CommandOption>>;
  operatorCommand: Passthrough<CommandProps<CommandOption>, CommandEmits<CommandOption>>;
  calendarWrapper: Passthrough<GroupProps>;
  calendar: Passthrough<CalendarProps, CalendarEmits>;
  rangeCalendar: Passthrough<RangeCalendarProps, RangeCalendarEmits>;
  actions: Passthrough<GroupProps>;
  applyButton: Passthrough<ButtonProps, ButtonEmits>;
};

export type DateFiltersProps = {
  modelValue?: DateFilter[];
  fields: DateFieldConfig[];
  addFilter: (filter: DateFilter) => void;
  pt?: PT<DateFiltersPassthrough>;
};

export type DateFiltersEmits = ComponentEvents["date-filters"];

export type DateFiltersContext = {
  fields: DateFieldConfig[];
  filters?: DateFilter[];
  activeCount: number;
  el: ComponentPublicInstance | null;
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
