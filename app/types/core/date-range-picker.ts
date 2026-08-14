import type { EmProps } from "../common/em";
import type { IconProps } from "../common/icon";
import type {
  DateRangePickerRootProps,
  DateRangePickerRootEmits,
} from "../common/date-range-picker/root";
import type {
  DateRangePickerFieldProps,
  DateRangePickerFieldSlotProps,
  DateRangePickerSegment,
} from "../common/date-range-picker/field";
import type { DateRangePickerInputProps } from "../common/date-range-picker/input";
import type {
  DateRangePickerTriggerProps,
  DateRangePickerTriggerEmits,
} from "../common/date-range-picker/trigger";
import type {
  DateRangePickerContentProps,
  DateRangePickerContentEmits,
} from "../common/date-range-picker/content";
import type {
  DateRangePickerCalendarProps,
  DateRangePickerCalendarSlotProps,
} from "../common/date-range-picker/calendar";
import type { DateRangePickerHeaderProps } from "../common/date-range-picker/header";
import type { DateRangePickerHeadingProps } from "../common/date-range-picker/heading";
import type {
  DateRangePickerPrevProps,
  DateRangePickerPrevEmits,
} from "../common/date-range-picker/prev";
import type {
  DateRangePickerNextProps,
  DateRangePickerNextEmits,
} from "../common/date-range-picker/next";
import type { DateRangePickerGridProps } from "../common/date-range-picker/grid";
import type { DateRangePickerGridHeadProps } from "../common/date-range-picker/grid-head";
import type { DateRangePickerGridBodyProps } from "../common/date-range-picker/grid-body";
import type { DateRangePickerGridRowProps } from "../common/date-range-picker/grid-row";
import type { DateRangePickerHeadCellProps } from "../common/date-range-picker/head-cell";
import type { DateRangePickerCellProps } from "../common/date-range-picker/cell";
import type {
  DateRangePickerCellTriggerProps,
  DateRangePickerCellTriggerEmits,
} from "../common/date-range-picker/cell-trigger";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { DateValue } from "@internationalized/date";
import type { DateRange } from "reka-ui";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

// The share of the field's render-scope payload the core template forwards.
export type DateRangePickerSegments = Pick<
  DateRangePickerFieldSlotProps,
  "segments"
>;

// One input part of the field: a segment plus the side of the range it edits.
export type DateRangePickerInputItem = {
  segment: DateRangePickerSegment;
  type: "start" | "end";
};

// The share of the calendar's render-scope payload the core template
// forwards into its slots.
export type DateRangePickerView = Pick<
  DateRangePickerCalendarSlotProps,
  "weekDays" | "grid"
>;

// One month of the calendar's render-scope grid payload.
export type DateRangePickerMonth = DateRangePickerView["grid"][number];

export type DateRangePickerPassthrough = {
  root: Passthrough<DateRangePickerRootProps, DateRangePickerRootEmits>;
  field: Passthrough<DateRangePickerFieldProps>;
  input: PassthroughIter<DateRangePickerInputItem, DateRangePickerInputProps>;
  separator: Passthrough<EmProps>;
  trigger: Passthrough<DateRangePickerTriggerProps, DateRangePickerTriggerEmits>;
  triggerIcon: Passthrough<IconProps>;
  content: Passthrough<DateRangePickerContentProps, DateRangePickerContentEmits>;
  calendar: Passthrough<DateRangePickerCalendarProps>;
  header: Passthrough<DateRangePickerHeaderProps>;
  prev: Passthrough<DateRangePickerPrevProps, DateRangePickerPrevEmits>;
  prevIcon: Passthrough<IconProps>;
  heading: Passthrough<DateRangePickerHeadingProps>;
  next: Passthrough<DateRangePickerNextProps, DateRangePickerNextEmits>;
  nextIcon: Passthrough<IconProps>;
  grid: Passthrough<DateRangePickerGridProps>;
  gridHead: Passthrough<DateRangePickerGridHeadProps>;
  gridBody: Passthrough<DateRangePickerGridBodyProps>;
  gridRow: Passthrough<DateRangePickerGridRowProps>;
  headCell: Passthrough<DateRangePickerHeadCellProps>;
  cell: PassthroughIter<DateValue, DateRangePickerCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    DateRangePickerCellTriggerProps,
    DateRangePickerCellTriggerEmits
  >;
};

// `modelValue` is required: the picker uses the explicit model contract
// (MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so consumers always provide it, `undefined` included.
export type DateRangePickerProps = {
  modelValue: DateRange | undefined;
  open?: boolean;
  pt?: PT<DateRangePickerPassthrough>;
};

export type DateRangePickerEmits = {
  "update:modelValue": [value: DateRange | undefined];
  "update:open": [value: boolean];
};

export type DateRangePickerContext = {
  modelValue: Ref<DateRange | undefined>;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: DateRangePickerPassthrough;
};

export type DateRangePickerSlots = {
  field?: (props: DateRangePickerContext & DateRangePickerSegments) => VNode[];
  input?: (props: DateRangePickerContext & DateRangePickerInputItem) => VNode[];
  separator?: (props: DateRangePickerContext) => VNode[];
  trigger?: (props: DateRangePickerContext) => VNode[];
  triggerIcon?: (props: DateRangePickerContext) => VNode[];
  content?: (props: DateRangePickerContext) => VNode[];
  header?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  prev?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  prevIcon?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  heading?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  next?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  nextIcon?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  grid?: (props: DateRangePickerContext & DateRangePickerView & { month: DateRangePickerMonth }) => VNode[];
  gridHead?: (props: DateRangePickerContext & DateRangePickerView & { month: DateRangePickerMonth }) => VNode[];
  gridBody?: (props: DateRangePickerContext & DateRangePickerView & { month: DateRangePickerMonth }) => VNode[];
  headCell?: (props: DateRangePickerContext & { day: string }) => VNode[];
  cell?: (props: DateRangePickerContext & { month: DateRangePickerMonth; date: DateValue }) => VNode[];
  cellTrigger?: (props: DateRangePickerContext & { month: DateRangePickerMonth; date: DateValue }) => VNode[];
};
