import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { SlotProps } from "../slots";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  RangeCalendarRoot,
  RangeCalendarRootProps,
  RangeCalendarRootEmits,
  RangeCalendarHeaderProps,
  RangeCalendarHeadingProps,
  RangeCalendarPrevProps,
  RangeCalendarNextProps,
  RangeCalendarGridProps,
  RangeCalendarGridHeadProps,
  RangeCalendarGridBodyProps,
  RangeCalendarGridRowProps,
  RangeCalendarHeadCellProps,
  RangeCalendarCellProps,
  RangeCalendarCellTriggerProps, DateRange 
} from "reka-ui";
import type { DateValue } from "@internationalized/date";

// The share of the root's render-scope payload the core template forwards
// into its slots.
export type RangeCalendarView = Pick<SlotProps<typeof RangeCalendarRoot>, "weekDays" | "grid">;

// One month of the root's render-scope grid payload.
export type RangeCalendarMonth = RangeCalendarView["grid"][number];

export type RangeCalendarPassthrough = {
  root: Passthrough<RangeCalendarRootProps, RangeCalendarRootEmits>;
  header: Passthrough<RangeCalendarHeaderProps>;
  prev: Passthrough<RangeCalendarPrevProps>;
  heading: Passthrough<RangeCalendarHeadingProps>;
  next: Passthrough<RangeCalendarNextProps>;
  grid: Passthrough<RangeCalendarGridProps>;
  gridHead: Passthrough<RangeCalendarGridHeadProps>;
  gridBody: Passthrough<RangeCalendarGridBodyProps>;
  gridRow: Passthrough<RangeCalendarGridRowProps>;
  headCell: Passthrough<RangeCalendarHeadCellProps>;
  cell: PassthroughIter<DateValue, RangeCalendarCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    RangeCalendarCellTriggerProps
  >;
};

// `modelValue` is required: the range calendar uses the explicit model contract
// (MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so consumers always provide it, `undefined` included.
export type RangeCalendarProps = {
  modelValue: DateRange | undefined;
  maxValue?: DateValue;
  pt?: PT<RangeCalendarPassthrough>;
};

export type RangeCalendarEmits = {
  "update:modelValue": [value: DateRange | undefined];
};

export type RangeCalendarContext = {
  maxValue?: DateValue;
  modelValue: Ref<DateRange | undefined>;
  el: ComponentPublicInstance | null;
  settings: RangeCalendarPassthrough;
};

export type RangeCalendarSlots = {
  header?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  prev?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  prevIcon?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  heading?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  next?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  nextIcon?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  grid?: (props: RangeCalendarContext & RangeCalendarView & { month: RangeCalendarMonth }) => VNode[];
  gridHead?: (props: RangeCalendarContext & RangeCalendarView & { month: RangeCalendarMonth }) => VNode[];
  gridBody?: (props: RangeCalendarContext & RangeCalendarView & { month: RangeCalendarMonth }) => VNode[];
  headCell?: (props: RangeCalendarContext & { day: string }) => VNode[];
  cell?: (props: RangeCalendarContext & { month: RangeCalendarMonth; date: DateValue }) => VNode[];
  cellTrigger?: (props: RangeCalendarContext & { month: RangeCalendarMonth; date: DateValue }) => VNode[];
};
