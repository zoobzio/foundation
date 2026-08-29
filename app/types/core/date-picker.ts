import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { SlotProps } from "../slots";
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

// reka's DatePickerField and DatePickerCalendar declare no props — they are
// pure render-scope payload providers, so their passthrough surface is empty.
export type DatePickerFieldProps = Record<string, never>;
export type DatePickerCalendarProps = Record<string, never>;

// The render-scope payload reka delivers through the field's default slot
// (segments + a modelValue snapshot), derived from the imported component.
export type DatePickerFieldSlotProps = SlotProps<typeof DatePickerField>;

// One segment of the field's render-scope payload.
export type DatePickerSegment = DatePickerFieldSlotProps["segments"][number];

// The share of the field's render-scope payload the core template forwards.
export type DatePickerSegments = Pick<DatePickerFieldSlotProps, "segments">;

// The share of the calendar's render-scope payload the core template
// forwards into its slots.
export type DatePickerView = Pick<
  SlotProps<typeof DatePickerCalendar>,
  "weekDays" | "grid"
>;

// One month of the calendar's render-scope grid payload.
export type DatePickerMonth = DatePickerView["grid"][number];

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

// `modelValue` is required: the picker uses the explicit model contract
// (MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so consumers always provide it, `undefined` included.
export type DatePickerProps = {
  modelValue: DateValue | undefined;
  open?: boolean;
  disabled?: boolean;
  pt?: PT<DatePickerPassthrough>;
};

export type DatePickerEmits = {
  "update:modelValue": [value: DateValue | undefined];
  "update:open": [value: boolean];
};

export type DatePickerContext = {
  disabled?: boolean;
  modelValue: Ref<DateValue | undefined>;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: DatePickerPassthrough;
};

export type DatePickerSlots = {
  field?: (props: DatePickerContext & DatePickerSegments) => VNode[];
  input?: (props: DatePickerContext & { segment: DatePickerSegment }) => VNode[];
  trigger?: (props: DatePickerContext) => VNode[];
  triggerIcon?: (props: DatePickerContext) => VNode[];
  content?: (props: DatePickerContext) => VNode[];
  header?: (props: DatePickerContext & DatePickerView) => VNode[];
  prev?: (props: DatePickerContext & DatePickerView) => VNode[];
  prevIcon?: (props: DatePickerContext & DatePickerView) => VNode[];
  heading?: (props: DatePickerContext & DatePickerView) => VNode[];
  next?: (props: DatePickerContext & DatePickerView) => VNode[];
  nextIcon?: (props: DatePickerContext & DatePickerView) => VNode[];
  grid?: (props: DatePickerContext & DatePickerView & { month: DatePickerMonth }) => VNode[];
  gridHead?: (props: DatePickerContext & DatePickerView & { month: DatePickerMonth }) => VNode[];
  gridBody?: (props: DatePickerContext & DatePickerView & { month: DatePickerMonth }) => VNode[];
  headCell?: (props: DatePickerContext & { day: string }) => VNode[];
  cell?: (props: DatePickerContext & { month: DatePickerMonth; date: DateValue }) => VNode[];
  cellTrigger?: (props: DatePickerContext & { month: DatePickerMonth; date: DateValue }) => VNode[];
};
