import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { SlotProps } from "../slots";
import type { Definition } from "../definition";
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
  RangeCalendarCellTriggerProps,
  DateRange,
} from "reka-ui";
import type { DateValue } from "@internationalized/date";

/**
 * The part of the root's slot payload that the slots receive.
 * Derived from the reka component.
 */
export type DateRangeGridView = Pick<
  SlotProps<typeof RangeCalendarRoot>,
  "weekDays" | "grid"
>;

/**
 * One month of the grid payload.
 */
export type DateRangeGridMonth = DateRangeGridView["grid"][number];

/**
 * The parts of the date range grid that accept passthrough.
 */
export type DateRangeGridPassthrough = {
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

/**
 * Props of the date range grid. `modelValue` is required. Its presence on
 * the vnode decides control, so pass `undefined` explicitly for an
 * uncontrolled instance.
 */
export type DateRangeGridProps = {
  modelValue: DateRange | undefined;
  maxValue?: DateValue;
  pt?: PT<DateRangeGridPassthrough>;
};

/**
 * Emits of the date range grid.
 */
export type DateRangeGridEmits = {
  "update:modelValue": [value: DateRange | undefined];
};

/**
 * The date range grid view model, served to `defineExpose` and the slots.
 */
export type DateRangeGridContext = {
  maxValue?: DateValue;
  modelValue: Ref<DateRange | undefined>;
  el: ComponentPublicInstance | null;
  settings: DateRangeGridPassthrough;
};

/**
 * Slots of the date range grid. Each slot receives the context.
 * Header and grid slots also receive the view. Cell slots also receive
 * the `month` and `date`.
 */
export type DateRangeGridSlots = {
  header?: (props: DateRangeGridContext & DateRangeGridView) => VNode[];
  prev?: (props: DateRangeGridContext & DateRangeGridView) => VNode[];
  heading?: (props: DateRangeGridContext & DateRangeGridView) => VNode[];
  next?: (props: DateRangeGridContext & DateRangeGridView) => VNode[];
  grid?: (
    props: DateRangeGridContext &
      DateRangeGridView & { month: DateRangeGridMonth },
  ) => VNode[];
  gridHead?: (
    props: DateRangeGridContext &
      DateRangeGridView & { month: DateRangeGridMonth },
  ) => VNode[];
  gridBody?: (
    props: DateRangeGridContext &
      DateRangeGridView & { month: DateRangeGridMonth },
  ) => VNode[];
  headCell?: (props: DateRangeGridContext & { day: string }) => VNode[];
  cell?: (
    props: DateRangeGridContext & {
      month: DateRangeGridMonth;
      date: DateValue;
    },
  ) => VNode[];
  cellTrigger?: (
    props: DateRangeGridContext & {
      month: DateRangeGridMonth;
      date: DateValue;
    },
  ) => VNode[];
  prevPrepend?: (props: DateRangeGridContext & DateRangeGridView) => VNode[];
  prevAppend?: (props: DateRangeGridContext & DateRangeGridView) => VNode[];
  nextPrepend?: (props: DateRangeGridContext & DateRangeGridView) => VNode[];
  nextAppend?: (props: DateRangeGridContext & DateRangeGridView) => VNode[];
};

/**
 * A date range grid instance as data: props plus emit listeners.
 */
export type DateRangeGridDefinition = Definition<
  DateRangeGridProps,
  DateRangeGridEmits
>;
