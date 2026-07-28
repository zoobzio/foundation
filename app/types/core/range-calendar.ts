import type { IconProps } from "#foundation/types/common/icon";
import type {
  RangeCalendarRootProps,
  RangeCalendarRootEmits,
  RangeCalendarRootSlotProps,
} from "#foundation/types/common/range-calendar/root";
import type { RangeCalendarHeaderProps } from "#foundation/types/common/range-calendar/header";
import type { RangeCalendarHeadingProps } from "#foundation/types/common/range-calendar/heading";
import type {
  RangeCalendarPrevProps,
  RangeCalendarPrevEmits,
} from "#foundation/types/common/range-calendar/prev";
import type {
  RangeCalendarNextProps,
  RangeCalendarNextEmits,
} from "#foundation/types/common/range-calendar/next";
import type { RangeCalendarGridProps } from "#foundation/types/common/range-calendar/grid";
import type { RangeCalendarGridHeadProps } from "#foundation/types/common/range-calendar/grid-head";
import type { RangeCalendarGridBodyProps } from "#foundation/types/common/range-calendar/grid-body";
import type { RangeCalendarGridRowProps } from "#foundation/types/common/range-calendar/grid-row";
import type { RangeCalendarHeadCellProps } from "#foundation/types/common/range-calendar/head-cell";
import type { RangeCalendarCellProps } from "#foundation/types/common/range-calendar/cell";
import type {
  RangeCalendarCellTriggerProps,
  RangeCalendarCellTriggerEmits,
} from "#foundation/types/common/range-calendar/cell-trigger";
import type { ComponentEvents } from "#foundation/types/events";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type { DateValue } from "@internationalized/date";
import type { DateRange } from "reka-ui";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

// The share of the root's render-scope payload the core template forwards
// into its slots.
export type RangeCalendarView = Pick<RangeCalendarRootSlotProps, "weekDays" | "grid">;

// One month of the root's render-scope grid payload.
export type RangeCalendarMonth = RangeCalendarView["grid"][number];

export type RangeCalendarPassthrough = {
  root: Passthrough<RangeCalendarRootProps, RangeCalendarRootEmits>;
  header: Passthrough<RangeCalendarHeaderProps>;
  prev: Passthrough<RangeCalendarPrevProps, RangeCalendarPrevEmits>;
  prevIcon: Passthrough<IconProps>;
  heading: Passthrough<RangeCalendarHeadingProps>;
  next: Passthrough<RangeCalendarNextProps, RangeCalendarNextEmits>;
  nextIcon: Passthrough<IconProps>;
  grid: Passthrough<RangeCalendarGridProps>;
  gridHead: Passthrough<RangeCalendarGridHeadProps>;
  gridBody: Passthrough<RangeCalendarGridBodyProps>;
  gridRow: Passthrough<RangeCalendarGridRowProps>;
  headCell: Passthrough<RangeCalendarHeadCellProps>;
  cell: PassthroughIter<DateValue, RangeCalendarCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    RangeCalendarCellTriggerProps,
    RangeCalendarCellTriggerEmits
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

export type RangeCalendarEmits = ComponentEvents["calendar"] & {
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
