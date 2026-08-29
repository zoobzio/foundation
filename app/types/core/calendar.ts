import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { SlotProps } from "../slots";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  CalendarRoot,
  CalendarRootProps,
  CalendarRootEmits,
  CalendarHeaderProps,
  CalendarHeadingProps,
  CalendarPrevProps,
  CalendarNextProps,
  CalendarGridProps,
  CalendarGridHeadProps,
  CalendarGridBodyProps,
  CalendarGridRowProps,
  CalendarHeadCellProps,
  CalendarCellProps,
  CalendarCellTriggerProps,
} from "reka-ui";
import type { DateValue } from "@internationalized/date";

// The share of the root's render-scope payload the core template forwards
// into its slots.
export type CalendarView = Pick<SlotProps<typeof CalendarRoot>, "weekDays" | "grid">;

// One month of the root's render-scope grid payload.
export type CalendarMonth = CalendarView["grid"][number];

export type CalendarPassthrough = {
  root: Passthrough<CalendarRootProps, CalendarRootEmits>;
  header: Passthrough<CalendarHeaderProps>;
  prev: Passthrough<CalendarPrevProps>;
  heading: Passthrough<CalendarHeadingProps>;
  next: Passthrough<CalendarNextProps>;
  grid: Passthrough<CalendarGridProps>;
  gridHead: Passthrough<CalendarGridHeadProps>;
  gridBody: Passthrough<CalendarGridBodyProps>;
  gridRow: Passthrough<CalendarGridRowProps>;
  headCell: Passthrough<CalendarHeadCellProps>;
  cell: PassthroughIter<DateValue, CalendarCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    CalendarCellTriggerProps
  >;
};

// `modelValue` is required: the calendar uses the explicit model contract
// (MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so consumers always provide it, `undefined` included.
export type CalendarProps = {
  modelValue: DateValue | undefined;
  maxValue?: DateValue;
  pt?: PT<CalendarPassthrough>;
};

export type CalendarEmits = {
  "update:modelValue": [value: DateValue | undefined];
};

export type CalendarContext = {
  maxValue?: DateValue;
  modelValue: Ref<DateValue | undefined>;
  el: ComponentPublicInstance | null;
  settings: CalendarPassthrough;
};

export type CalendarSlots = {
  header?: (props: CalendarContext & CalendarView) => VNode[];
  prev?: (props: CalendarContext & CalendarView) => VNode[];
  prevIcon?: (props: CalendarContext & CalendarView) => VNode[];
  heading?: (props: CalendarContext & CalendarView) => VNode[];
  next?: (props: CalendarContext & CalendarView) => VNode[];
  nextIcon?: (props: CalendarContext & CalendarView) => VNode[];
  grid?: (props: CalendarContext & CalendarView & { month: CalendarMonth }) => VNode[];
  gridHead?: (props: CalendarContext & CalendarView & { month: CalendarMonth }) => VNode[];
  gridBody?: (props: CalendarContext & CalendarView & { month: CalendarMonth }) => VNode[];
  headCell?: (props: CalendarContext & { day: string }) => VNode[];
  cell?: (props: CalendarContext & { month: CalendarMonth; date: DateValue }) => VNode[];
  cellTrigger?: (props: CalendarContext & { month: CalendarMonth; date: DateValue }) => VNode[];
};
