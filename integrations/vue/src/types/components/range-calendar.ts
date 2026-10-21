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
export type RangeCalendarView = Pick<
  SlotProps<typeof RangeCalendarRoot>,
  "weekDays" | "grid"
>;

/**
 * One month of the grid payload.
 */
export type RangeCalendarMonth = RangeCalendarView["grid"][number];

/**
 * The parts of the range calendar that accept passthrough.
 */
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

/**
 * Props of the range calendar. `modelValue` is required. Its presence on
 * the vnode decides control, so pass `undefined` explicitly for an
 * uncontrolled instance.
 */
export type RangeCalendarProps = {
  modelValue: DateRange | undefined;
  maxValue?: DateValue;
  pt?: PT<RangeCalendarPassthrough>;
};

/**
 * Emits of the range calendar.
 */
export type RangeCalendarEmits = {
  "update:modelValue": [value: DateRange | undefined];
};

/**
 * The range calendar view model, served to `defineExpose` and the slots.
 */
export type RangeCalendarContext = {
  maxValue?: DateValue;
  modelValue: Ref<DateRange | undefined>;
  el: ComponentPublicInstance | null;
  settings: RangeCalendarPassthrough;
};

/**
 * Slots of the range calendar. Each slot receives the context.
 * Header and grid slots also receive the view. Cell slots also receive
 * the `month` and `date`.
 */
export type RangeCalendarSlots = {
  header?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  prev?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  prevIcon?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  heading?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  next?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  nextIcon?: (props: RangeCalendarContext & RangeCalendarView) => VNode[];
  grid?: (
    props: RangeCalendarContext &
      RangeCalendarView & { month: RangeCalendarMonth },
  ) => VNode[];
  gridHead?: (
    props: RangeCalendarContext &
      RangeCalendarView & { month: RangeCalendarMonth },
  ) => VNode[];
  gridBody?: (
    props: RangeCalendarContext &
      RangeCalendarView & { month: RangeCalendarMonth },
  ) => VNode[];
  headCell?: (props: RangeCalendarContext & { day: string }) => VNode[];
  cell?: (
    props: RangeCalendarContext & {
      month: RangeCalendarMonth;
      date: DateValue;
    },
  ) => VNode[];
  cellTrigger?: (
    props: RangeCalendarContext & {
      month: RangeCalendarMonth;
      date: DateValue;
    },
  ) => VNode[];
};

/**
 * A range calendar instance as data: props plus emit listeners.
 */
export type RangeCalendarDefinition = Definition<
  RangeCalendarProps,
  RangeCalendarEmits
>;
