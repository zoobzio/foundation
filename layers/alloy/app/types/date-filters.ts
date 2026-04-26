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
