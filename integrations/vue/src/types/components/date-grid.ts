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
export type DateGridView = Pick<
  SlotProps<typeof CalendarRoot>,
  "weekDays" | "grid"
>;

/**
 * One month of the grid.
 */
export type DateGridMonth = DateGridView["grid"][number];

/**
 * The parts of the date grid that accept passthrough.
 */
export type DateGridPassthrough = {
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
 * Props of the date grid. `modelValue` is required. Its presence on the vnode
 * decides control, so pass `undefined` explicitly for an uncontrolled instance.
 */
export type DateGridProps = {
  modelValue: DateValue | undefined;
  maxValue?: DateValue;
  pt?: PT<DateGridPassthrough>;
};

/**
 * Emits of the date grid.
 */
export type DateGridEmits = {
  "update:modelValue": [value: DateValue | undefined];
};

/**
 * The date grid view model, served to `defineExpose` and the slots.
 */
export type DateGridContext = {
  maxValue?: DateValue;
  modelValue: Ref<DateValue | undefined>;
  el: ComponentPublicInstance | null;
  settings: DateGridPassthrough;
};

/**
 * Slots of the date grid. Each slot receives the context. Grid slots also
 * receive the view and the `month`.
 */
export type DateGridSlots = {
  header?: (props: DateGridContext & DateGridView) => VNode[];
  prev?: (props: DateGridContext & DateGridView) => VNode[];
  heading?: (props: DateGridContext & DateGridView) => VNode[];
  next?: (props: DateGridContext & DateGridView) => VNode[];
  grid?: (
    props: DateGridContext & DateGridView & { month: DateGridMonth },
  ) => VNode[];
  gridHead?: (
    props: DateGridContext & DateGridView & { month: DateGridMonth },
  ) => VNode[];
  gridBody?: (
    props: DateGridContext & DateGridView & { month: DateGridMonth },
  ) => VNode[];
  headCell?: (props: DateGridContext & { day: string }) => VNode[];
  cell?: (
    props: DateGridContext & { month: DateGridMonth; date: DateValue },
  ) => VNode[];
  cellTrigger?: (
    props: DateGridContext & { month: DateGridMonth; date: DateValue },
  ) => VNode[];
  prevPrepend?: (props: DateGridContext & DateGridView) => VNode[];
  prevAppend?: (props: DateGridContext & DateGridView) => VNode[];
  nextPrepend?: (props: DateGridContext & DateGridView) => VNode[];
  nextAppend?: (props: DateGridContext & DateGridView) => VNode[];
};

/**
 * A date grid instance as data: props plus emit listeners.
 */
export type DateGridDefinition = Definition<DateGridProps, DateGridEmits>;
