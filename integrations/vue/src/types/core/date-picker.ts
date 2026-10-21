import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { SlotProps } from "../slots";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  DatePickerField,
  DatePickerCalendar,
  DatePickerRootProps,
  DatePickerRootEmits,
  DatePickerInputProps,
  DatePickerTriggerProps,
  DatePickerContentProps,
  DatePickerContentEmits,
  DatePickerHeaderProps,
  DatePickerHeadingProps,
  DatePickerPrevProps,
  DatePickerNextProps,
  DatePickerGridProps,
  DatePickerGridHeadProps,
  DatePickerGridBodyProps,
  DatePickerGridRowProps,
  DatePickerHeadCellProps,
  DatePickerCellProps,
  DatePickerCellTriggerProps,
} from "reka-ui";
import type { DateValue } from "@internationalized/date";

/**
 * Empty. reka's `DatePickerField` declares no props.
 */
export type DatePickerFieldProps = Record<string, never>;
/**
 * Empty. reka's `DatePickerCalendar` declares no props.
 */
export type DatePickerCalendarProps = Record<string, never>;

/**
 * The default-slot payload of reka's `DatePickerField`.
 */
export type DatePickerFieldSlotProps = SlotProps<typeof DatePickerField>;

/**
 * One segment of the field.
 */
export type DatePickerSegment = DatePickerFieldSlotProps["segments"][number];

/**
 * The part of the field payload the template forwards to its slots.
 */
export type DatePickerSegments = Pick<DatePickerFieldSlotProps, "segments">;

/**
 * The part of the calendar payload the template forwards to its slots.
 */
export type DatePickerView = Pick<
  SlotProps<typeof DatePickerCalendar>,
  "weekDays" | "grid"
>;

/**
 * One month of the calendar grid.
 */
export type DatePickerMonth = DatePickerView["grid"][number];

/**
 * The parts of the date picker that accept passthrough.
 */
export type DatePickerPassthrough = {
  root: Passthrough<DatePickerRootProps, DatePickerRootEmits>;
  field: Passthrough<DatePickerFieldProps>;
  input: PassthroughIter<DatePickerSegment, DatePickerInputProps>;
  trigger: Passthrough<DatePickerTriggerProps>;
  content: Passthrough<DatePickerContentProps, DatePickerContentEmits>;
  calendar: Passthrough<DatePickerCalendarProps>;
  header: Passthrough<DatePickerHeaderProps>;
  prev: Passthrough<DatePickerPrevProps>;
  heading: Passthrough<DatePickerHeadingProps>;
  next: Passthrough<DatePickerNextProps>;
  grid: Passthrough<DatePickerGridProps>;
  gridHead: Passthrough<DatePickerGridHeadProps>;
  gridBody: Passthrough<DatePickerGridBodyProps>;
  gridRow: Passthrough<DatePickerGridRowProps>;
  headCell: Passthrough<DatePickerHeadCellProps>;
  cell: PassthroughIter<DateValue, DatePickerCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    DatePickerCellTriggerProps
  >;
};

/**
 * Props of the date picker. `modelValue` is required. Its presence on the vnode
 * decides control, so pass `undefined` explicitly for an uncontrolled instance.
 */
export type DatePickerProps = {
  modelValue: DateValue | undefined;
  open?: boolean;
  disabled?: boolean;
  pt?: PT<DatePickerPassthrough>;
};

/**
 * Emits of the date picker.
 */
export type DatePickerEmits = {
  "update:modelValue": [value: DateValue | undefined];
  "update:open": [value: boolean];
};

/**
 * The date picker view model, served to `defineExpose` and the slots.
 */
export type DatePickerContext = {
  disabled?: boolean;
  modelValue: Ref<DateValue | undefined>;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: DatePickerPassthrough;
};

/**
 * Slots of the date picker. Each slot receives the context. Grid slots also
 * receive the view and the `month`.
 */
export type DatePickerSlots = {
  field?: (props: DatePickerContext & DatePickerSegments) => VNode[];
  input?: (
    props: DatePickerContext & { segment: DatePickerSegment },
  ) => VNode[];
  trigger?: (props: DatePickerContext) => VNode[];
  triggerIcon?: (props: DatePickerContext) => VNode[];
  content?: (props: DatePickerContext) => VNode[];
  header?: (props: DatePickerContext & DatePickerView) => VNode[];
  prev?: (props: DatePickerContext & DatePickerView) => VNode[];
  prevIcon?: (props: DatePickerContext & DatePickerView) => VNode[];
  heading?: (props: DatePickerContext & DatePickerView) => VNode[];
  next?: (props: DatePickerContext & DatePickerView) => VNode[];
  nextIcon?: (props: DatePickerContext & DatePickerView) => VNode[];
  grid?: (
    props: DatePickerContext & DatePickerView & { month: DatePickerMonth },
  ) => VNode[];
  gridHead?: (
    props: DatePickerContext & DatePickerView & { month: DatePickerMonth },
  ) => VNode[];
  gridBody?: (
    props: DatePickerContext & DatePickerView & { month: DatePickerMonth },
  ) => VNode[];
  headCell?: (props: DatePickerContext & { day: string }) => VNode[];
  cell?: (
    props: DatePickerContext & { month: DatePickerMonth; date: DateValue },
  ) => VNode[];
  cellTrigger?: (
    props: DatePickerContext & { month: DatePickerMonth; date: DateValue },
  ) => VNode[];
};

/**
 * A date picker instance as data: props plus emit listeners.
 */
export type DatePickerDefinition = Definition<DatePickerProps, DatePickerEmits>;
