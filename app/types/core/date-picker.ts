import type { IconProps } from "../common/icon";
import type {
  DatePickerRootProps,
  DatePickerRootEmits,
} from "../common/date-picker/root";
import type {
  DatePickerFieldProps,
  DatePickerFieldSlotProps,
  DatePickerSegment,
} from "../common/date-picker/field";
import type { DatePickerInputProps } from "../common/date-picker/input";
import type {
  DatePickerTriggerProps,
  DatePickerTriggerEmits,
} from "../common/date-picker/trigger";
import type {
  DatePickerContentProps,
  DatePickerContentEmits,
} from "../common/date-picker/content";
import type {
  DatePickerCalendarProps,
  DatePickerCalendarSlotProps,
} from "../common/date-picker/calendar";
import type { DatePickerHeaderProps } from "../common/date-picker/header";
import type { DatePickerHeadingProps } from "../common/date-picker/heading";
import type {
  DatePickerPrevProps,
  DatePickerPrevEmits,
} from "../common/date-picker/prev";
import type {
  DatePickerNextProps,
  DatePickerNextEmits,
} from "../common/date-picker/next";
import type { DatePickerGridProps } from "../common/date-picker/grid";
import type { DatePickerGridHeadProps } from "../common/date-picker/grid-head";
import type { DatePickerGridBodyProps } from "../common/date-picker/grid-body";
import type { DatePickerGridRowProps } from "../common/date-picker/grid-row";
import type { DatePickerHeadCellProps } from "../common/date-picker/head-cell";
import type { DatePickerCellProps } from "../common/date-picker/cell";
import type {
  DatePickerCellTriggerProps,
  DatePickerCellTriggerEmits,
} from "../common/date-picker/cell-trigger";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

// The share of the field's render-scope payload the core template forwards.
export type DatePickerSegments = Pick<DatePickerFieldSlotProps, "segments">;

// The share of the calendar's render-scope payload the core template
// forwards into its slots.
export type DatePickerView = Pick<
  DatePickerCalendarSlotProps,
  "weekDays" | "grid"
>;

// One month of the calendar's render-scope grid payload.
export type DatePickerMonth = DatePickerView["grid"][number];

export type DatePickerPassthrough = {
  root: Passthrough<DatePickerRootProps, DatePickerRootEmits>;
  field: Passthrough<DatePickerFieldProps>;
  input: PassthroughIter<DatePickerSegment, DatePickerInputProps>;
  trigger: Passthrough<DatePickerTriggerProps, DatePickerTriggerEmits>;
  triggerIcon: Passthrough<IconProps>;
  content: Passthrough<DatePickerContentProps, DatePickerContentEmits>;
  calendar: Passthrough<DatePickerCalendarProps>;
  header: Passthrough<DatePickerHeaderProps>;
  prev: Passthrough<DatePickerPrevProps, DatePickerPrevEmits>;
  prevIcon: Passthrough<IconProps>;
  heading: Passthrough<DatePickerHeadingProps>;
  next: Passthrough<DatePickerNextProps, DatePickerNextEmits>;
  nextIcon: Passthrough<IconProps>;
  grid: Passthrough<DatePickerGridProps>;
  gridHead: Passthrough<DatePickerGridHeadProps>;
  gridBody: Passthrough<DatePickerGridBodyProps>;
  gridRow: Passthrough<DatePickerGridRowProps>;
  headCell: Passthrough<DatePickerHeadCellProps>;
  cell: PassthroughIter<DateValue, DatePickerCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    DatePickerCellTriggerProps,
    DatePickerCellTriggerEmits
  >;
};

// `modelValue` is required: the picker uses the explicit model contract
// (MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so consumers always provide it, `undefined` included.
export type DatePickerProps = {
  modelValue: DateValue | undefined;
  open?: boolean;
  disabled?: boolean;
  pt?: PT<DatePickerPassthrough>;
};

export type DatePickerEmits = {
  "update:modelValue": [value: DateValue | undefined];
  "update:open": [value: boolean];
};

export type DatePickerContext = {
  disabled?: boolean;
  modelValue: Ref<DateValue | undefined>;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: DatePickerPassthrough;
};

export type DatePickerSlots = {
  field?: (props: DatePickerContext & DatePickerSegments) => VNode[];
  input?: (props: DatePickerContext & { segment: DatePickerSegment }) => VNode[];
  trigger?: (props: DatePickerContext) => VNode[];
  triggerIcon?: (props: DatePickerContext) => VNode[];
  content?: (props: DatePickerContext) => VNode[];
  header?: (props: DatePickerContext & DatePickerView) => VNode[];
  prev?: (props: DatePickerContext & DatePickerView) => VNode[];
  prevIcon?: (props: DatePickerContext & DatePickerView) => VNode[];
  heading?: (props: DatePickerContext & DatePickerView) => VNode[];
  next?: (props: DatePickerContext & DatePickerView) => VNode[];
  nextIcon?: (props: DatePickerContext & DatePickerView) => VNode[];
  grid?: (props: DatePickerContext & DatePickerView & { month: DatePickerMonth }) => VNode[];
  gridHead?: (props: DatePickerContext & DatePickerView & { month: DatePickerMonth }) => VNode[];
  gridBody?: (props: DatePickerContext & DatePickerView & { month: DatePickerMonth }) => VNode[];
  headCell?: (props: DatePickerContext & { day: string }) => VNode[];
  cell?: (props: DatePickerContext & { month: DatePickerMonth; date: DateValue }) => VNode[];
  cellTrigger?: (props: DatePickerContext & { month: DatePickerMonth; date: DateValue }) => VNode[];
};
