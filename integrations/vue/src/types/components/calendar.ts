import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { SlotProps } from "../slots";
import type { Definition } from "../definition";
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

/**
 * The part of the root's slot payload the template forwards to its slots.
 */
export type CalendarView = Pick<
  SlotProps<typeof CalendarRoot>,
  "weekDays" | "grid"
>;

/**
 * One month of the calendar grid.
 */
export type CalendarMonth = CalendarView["grid"][number];

/**
 * The parts of the calendar that accept passthrough.
 */
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

/**
 * Props of the calendar. `modelValue` is required. Its presence on the vnode
 * decides control, so pass `undefined` explicitly for an uncontrolled instance.
 */
export type CalendarProps = {
  modelValue: DateValue | undefined;
  maxValue?: DateValue;
  pt?: PT<CalendarPassthrough>;
};

/**
 * Emits of the calendar.
 */
export type CalendarEmits = {
  "update:modelValue": [value: DateValue | undefined];
};

/**
 * The calendar view model, served to `defineExpose` and the slots.
 */
export type CalendarContext = {
  maxValue?: DateValue;
  modelValue: Ref<DateValue | undefined>;
  el: ComponentPublicInstance | null;
  settings: CalendarPassthrough;
};

/**
 * Slots of the calendar. Each slot receives the context. Grid slots also
 * receive the view and the `month`.
 */
export type CalendarSlots = {
  header?: (props: CalendarContext & CalendarView) => VNode[];
  prev?: (props: CalendarContext & CalendarView) => VNode[];
  heading?: (props: CalendarContext & CalendarView) => VNode[];
  next?: (props: CalendarContext & CalendarView) => VNode[];
  grid?: (
    props: CalendarContext & CalendarView & { month: CalendarMonth },
  ) => VNode[];
  gridHead?: (
    props: CalendarContext & CalendarView & { month: CalendarMonth },
  ) => VNode[];
  gridBody?: (
    props: CalendarContext & CalendarView & { month: CalendarMonth },
  ) => VNode[];
  headCell?: (props: CalendarContext & { day: string }) => VNode[];
  cell?: (
    props: CalendarContext & { month: CalendarMonth; date: DateValue },
  ) => VNode[];
  cellTrigger?: (
    props: CalendarContext & { month: CalendarMonth; date: DateValue },
  ) => VNode[];
  prevPrepend?: (props: CalendarContext & CalendarView) => VNode[];
  prevAppend?: (props: CalendarContext & CalendarView) => VNode[];
  nextPrepend?: (props: CalendarContext & CalendarView) => VNode[];
  nextAppend?: (props: CalendarContext & CalendarView) => VNode[];
};

/**
 * A calendar instance as data: props plus emit listeners.
 */
export type CalendarDefinition = Definition<CalendarProps, CalendarEmits>;
