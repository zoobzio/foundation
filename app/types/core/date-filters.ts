import type { ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { CalendarEmits, CalendarProps } from "#foundation/types/core/calendar";
import type { CommandEmits, CommandProps } from "#foundation/types/core/command";
import type { FabProps } from "#foundation/types/core/fab";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { PopoverEmits, PopoverProps } from "#foundation/types/core/popover";
import type { RangeCalendarEmits, RangeCalendarProps } from "#foundation/types/core/range-calendar";
import type { Recipe } from "#foundation/types/core/recipe";
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
  popover?: Passthrough<PopoverProps, PopoverEmits>;
  trigger?: Passthrough<FabProps>;
  root?: Passthrough<GroupProps>;
  stepper?: Passthrough<GroupProps>;
  stepSeparator?: Passthrough<IconProps>;
  fieldCommand?: Passthrough<CommandProps, CommandEmits>;
  operatorCommand?: Passthrough<CommandProps, CommandEmits>;
  calendarWrapper?: Passthrough<GroupProps>;
  calendar?: Passthrough<CalendarProps, CalendarEmits>;
  rangeCalendar?: Passthrough<RangeCalendarProps, RangeCalendarEmits>;
  actions?: Passthrough<GroupProps>;
  applyButton?: Passthrough<ButtonProps>;
};

export type DateFiltersProps = {
  modelValue?: DateFilter[];
  fields: DateFieldConfig[];
  addFilter: (filter: DateFilter) => void;
  removeFilter: (field: string) => void;
  pt?: DateFiltersPassthrough;
};

export type DateFiltersEmits = {
  "update:modelValue": [value: DateFilter[]];
};

export type DateFiltersRecipe = Recipe<DateFiltersProps, DateFiltersEmits>;
