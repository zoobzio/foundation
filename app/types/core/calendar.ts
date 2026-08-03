import type { IconProps } from "#foundation/types/common/icon";
import type {
  CalendarRootProps,
  CalendarRootEmits,
  CalendarRootSlotProps,
} from "#foundation/types/common/calendar/root";
import type { CalendarHeaderProps } from "#foundation/types/common/calendar/header";
import type { CalendarHeadingProps } from "#foundation/types/common/calendar/heading";
import type {
  CalendarPrevProps,
  CalendarPrevEmits,
} from "#foundation/types/common/calendar/prev";
import type {
  CalendarNextProps,
  CalendarNextEmits,
} from "#foundation/types/common/calendar/next";
import type { CalendarGridProps } from "#foundation/types/common/calendar/grid";
import type { CalendarGridHeadProps } from "#foundation/types/common/calendar/grid-head";
import type { CalendarGridBodyProps } from "#foundation/types/common/calendar/grid-body";
import type { CalendarGridRowProps } from "#foundation/types/common/calendar/grid-row";
import type { CalendarHeadCellProps } from "#foundation/types/common/calendar/head-cell";
import type { CalendarCellProps } from "#foundation/types/common/calendar/cell";
import type {
  CalendarCellTriggerProps,
  CalendarCellTriggerEmits,
} from "#foundation/types/common/calendar/cell-trigger";
import type { ComponentEvents } from "#foundation/types/events";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

// The share of the root's render-scope payload the core template forwards
// into its slots.
export type CalendarView = Pick<CalendarRootSlotProps, "weekDays" | "grid">;

// One month of the root's render-scope grid payload.
export type CalendarMonth = CalendarView["grid"][number];

export type CalendarPassthrough = {
  root: Passthrough<CalendarRootProps, CalendarRootEmits>;
  header: Passthrough<CalendarHeaderProps>;
  prev: Passthrough<CalendarPrevProps, CalendarPrevEmits>;
  prevIcon: Passthrough<IconProps>;
  heading: Passthrough<CalendarHeadingProps>;
  next: Passthrough<CalendarNextProps, CalendarNextEmits>;
  nextIcon: Passthrough<IconProps>;
  grid: Passthrough<CalendarGridProps>;
  gridHead: Passthrough<CalendarGridHeadProps>;
  gridBody: Passthrough<CalendarGridBodyProps>;
  gridRow: Passthrough<CalendarGridRowProps>;
  headCell: Passthrough<CalendarHeadCellProps>;
  cell: PassthroughIter<DateValue, CalendarCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    CalendarCellTriggerProps,
    CalendarCellTriggerEmits
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

export type CalendarEmits = ComponentEvents["calendar"] & {
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
