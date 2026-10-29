import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { SlotProps } from "../slots";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  DateRangePickerField,
  DateRangePickerCalendar,
  DateRangePickerRootProps,
  DateRangePickerRootEmits,
  DateRangePickerInputProps,
  DateRangePickerTriggerProps,
  DateRangePickerContentProps,
  DateRangePickerContentEmits,
  DateRangePickerHeaderProps,
  DateRangePickerHeadingProps,
  DateRangePickerPrevProps,
  DateRangePickerNextProps,
  DateRangePickerGridProps,
  DateRangePickerGridHeadProps,
  DateRangePickerGridBodyProps,
  DateRangePickerGridRowProps,
  DateRangePickerHeadCellProps,
  DateRangePickerCellProps,
  DateRangePickerCellTriggerProps,
  DateRange,
} from "reka-ui";
import type { DateValue } from "@internationalized/date";

/**
 * Empty. reka's `DateRangePickerField` declares no props.
 */
export type DateRangePickerFieldProps = Record<string, never>;
/**
 * Empty. reka's `DateRangePickerCalendar` declares no props.
 */
export type DateRangePickerCalendarProps = Record<string, never>;

/**
 * The default-slot payload of reka's `DateRangePickerField`.
 */
export type DateRangePickerFieldSlotProps = SlotProps<
  typeof DateRangePickerField
>;

/**
 * One segment of either side of the field.
 */
export type DateRangePickerSegment =
  DateRangePickerFieldSlotProps["segments"]["start"][number];

/**
 * The part of the field payload the template forwards to its slots.
 */
export type DateRangePickerSegments = Pick<
  DateRangePickerFieldSlotProps,
  "segments"
>;

/**
 * A segment plus the side of the range it edits.
 */
export type DateRangePickerInputItem = {
  segment: DateRangePickerSegment;
  type: "start" | "end";
};

/**
 * The part of the calendar payload the template forwards to its slots.
 */
export type DateRangePickerView = Pick<
  SlotProps<typeof DateRangePickerCalendar>,
  "weekDays" | "grid"
>;

/**
 * One month of the calendar grid.
 */
export type DateRangePickerMonth = DateRangePickerView["grid"][number];

/**
 * The parts of the date range picker that accept passthrough.
 */
export type DateRangePickerPassthrough = {
  root: Passthrough<DateRangePickerRootProps, DateRangePickerRootEmits>;
  field: Passthrough<DateRangePickerFieldProps>;
  input: PassthroughIter<DateRangePickerInputItem, DateRangePickerInputProps>;
  trigger: Passthrough<DateRangePickerTriggerProps>;
  content: Passthrough<
    DateRangePickerContentProps,
    DateRangePickerContentEmits
  >;
  calendar: Passthrough<DateRangePickerCalendarProps>;
  header: Passthrough<DateRangePickerHeaderProps>;
  prev: Passthrough<DateRangePickerPrevProps>;
  heading: Passthrough<DateRangePickerHeadingProps>;
  next: Passthrough<DateRangePickerNextProps>;
  grid: Passthrough<DateRangePickerGridProps>;
  gridHead: Passthrough<DateRangePickerGridHeadProps>;
  gridBody: Passthrough<DateRangePickerGridBodyProps>;
  gridRow: Passthrough<DateRangePickerGridRowProps>;
  headCell: Passthrough<DateRangePickerHeadCellProps>;
  cell: PassthroughIter<DateValue, DateRangePickerCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    DateRangePickerCellTriggerProps
  >;
};

/**
 * Props of the date range picker. `modelValue` is required. Its presence on the
 * vnode decides control, so pass `undefined` explicitly for an uncontrolled
 * instance.
 */
export type DateRangePickerProps = {
  modelValue: DateRange | undefined;
  open?: boolean;
  pt?: PT<DateRangePickerPassthrough>;
};

/**
 * Emits of the date range picker.
 */
export type DateRangePickerEmits = {
  "update:modelValue": [value: DateRange | undefined];
  "update:open": [value: boolean];
};

/**
 * The date range picker view model, served to `defineExpose` and the slots.
 */
export type DateRangePickerContext = {
  modelValue: Ref<DateRange | undefined>;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: DateRangePickerPassthrough;
};

/**
 * Slots of the date range picker. Each slot receives the context. Grid slots
 * also receive the view and the `month`.
 */
export type DateRangePickerSlots = {
  field?: (props: DateRangePickerContext & DateRangePickerSegments) => VNode[];
  input?: (props: DateRangePickerContext & DateRangePickerInputItem) => VNode[];
  separator?: (props: DateRangePickerContext) => VNode[];
  trigger?: (props: DateRangePickerContext) => VNode[];
  content?: (props: DateRangePickerContext) => VNode[];
  header?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  prev?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  heading?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  next?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  grid?: (
    props: DateRangePickerContext &
      DateRangePickerView & { month: DateRangePickerMonth },
  ) => VNode[];
  gridHead?: (
    props: DateRangePickerContext &
      DateRangePickerView & { month: DateRangePickerMonth },
  ) => VNode[];
  gridBody?: (
    props: DateRangePickerContext &
      DateRangePickerView & { month: DateRangePickerMonth },
  ) => VNode[];
  headCell?: (props: DateRangePickerContext & { day: string }) => VNode[];
  cell?: (
    props: DateRangePickerContext & {
      month: DateRangePickerMonth;
      date: DateValue;
    },
  ) => VNode[];
  cellTrigger?: (
    props: DateRangePickerContext & {
      month: DateRangePickerMonth;
      date: DateValue;
    },
  ) => VNode[];
  triggerPrepend?: (props: DateRangePickerContext) => VNode[];
  triggerAppend?: (props: DateRangePickerContext) => VNode[];
  prevPrepend?: (
    props: DateRangePickerContext & DateRangePickerView,
  ) => VNode[];
  prevAppend?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  nextPrepend?: (
    props: DateRangePickerContext & DateRangePickerView,
  ) => VNode[];
  nextAppend?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
};

/**
 * A date range picker instance as data: props plus emit listeners.
 */
export type DateRangePickerDefinition = Definition<
  DateRangePickerProps,
  DateRangePickerEmits
>;
